import * as XLSX from 'xlsx';

function flatRow(record) {
  const quiz = record.quizPayload || {};
  const summary = (record.quizSummary || [])
    .map((r) => `${r.question}: ${r.answer}`)
    .join(' | ');

  return {
    'Captured At': record.capturedAt ? new Date(record.capturedAt).toISOString() : '',
    'Completed At': record.completedAt ? new Date(record.completedAt).toISOString() : '',
    Category: record.category || '',
    Brand: record.brand || '',
    Model: record.modelName || '',
    Slug: record.slug || '',
    Storage: record.storage || quiz.storage || '',
    Status: record.agentStatus === 'skipped' ? 'overridden' : (record.agentStatus || ''),
    'Internal Price (INR)': record.internalPrice ?? '',
    'Cashify Price (INR)': record.cashifyPrice ?? '',
    'Our Offer (INR)': record.ourOffer ?? '',
    'Difference (INR)': record.difference ?? '',
    'Duration (ms)': record.durationMs ?? '',
    Source: record.sourceType || '',
    'Quiz Summary': summary,
    'Cashify URL': record.cashifyProductUrl || '',
    Error: record.error || '',
    Note: record.note || '',
  };
}

function jsonlRow(record) {
  const quiz = record.quizPayload || {};
  return {
    slug: record.slug,
    category: record.category,
    brand: record.brand,
    model: record.modelName,
    storage: record.storage || quiz.storage || '',
    agent_status: record.agentStatus === 'skipped' ? 'overridden' : record.agentStatus,
    internal_price: record.internalPrice,
    cashify_price: record.cashifyPrice,
    our_offer: record.ourOffer,
    difference: record.difference,
    device_age: quiz.deviceAge || quiz.yearBracket || quiz.age || null,
    power_status: quiz.powerStatus || null,
    ram: quiz.ram || null,
    processor: quiz.processor || null,
    physical_issues: quiz.physicalIssues || [],
    technical_issues: quiz.technicalIssues || [],
    functional_issues: quiz.functionalIssues || quiz.issuesList || [],
    screen_issues: quiz.screenIssues || quiz.screenIssuesList || [],
    body_issues: quiz.bodyIssues || quiz.bodyIssuesList || [],
    accessories: quiz.accessories || [],
    under_warranty: quiz.underWarranty ?? null,
    able_to_make_calls: quiz.ableToMakeCalls ?? null,
    is_touch_working: quiz.isTouchScreenWorking ?? null,
    is_screen_original: quiz.isScreenOriginal ?? null,
    captured_at: record.capturedAt,
    completed_at: record.completedAt,
    cashify_url: record.cashifyProductUrl || '',
    quiz_hash: record.quizHash,
  };
}

export function buildPricingRecordsWorkbook(records) {
  const rows = records.map(flatRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pricing Agent');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export function buildPricingRecordsCsv(records) {
  const rows = records.map(flatRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  return XLSX.utils.sheet_to_csv(worksheet);
}

export function buildPricingRecordsJsonl(records) {
  return records.map((r) => JSON.stringify(jsonlRow(r))).join('\n');
}
