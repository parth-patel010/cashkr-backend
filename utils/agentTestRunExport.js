import * as XLSX from 'xlsx';

function serializeRun(run) {
  return {
    id: run._id,
    category: run.category,
    brand: run.brand,
    modelName: run.modelName,
    slug: run.slug,
    storage: run.storage,
    status: run.status,
    comparison: run.comparison,
    internalResult: run.internalResult,
    cashifyResult: run.cashifyResult,
    quizPayload: run.quizPayload,
    runBy: run.runBy,
    durationMs: run.durationMs,
    error: run.error,
    createdAt: run.createdAt,
  };
}

function runToExcelRow(run) {
  const quiz = run.quizPayload || {};
  const variant = run.variant || {};
  return {
    'Run Date': run.createdAt ? new Date(run.createdAt).toISOString() : '',
    Category: run.category || '',
    Brand: run.brand || '',
    Model: run.modelName || '',
    Slug: run.slug || '',
    Storage: run.storage || quiz.storage || '',
    RAM: variant.ram || quiz.ram || '',
    Processor: variant.processor || quiz.processor || '',
    Status: run.status || '',
    'Internal Price (INR)': run.comparison?.internalPrice ?? '',
    'Cashify Price (INR)': run.comparison?.cashifyPrice ?? '',
    'Our Offer (INR)': run.comparison?.ourOffer ?? '',
    'Difference (INR)': run.comparison?.difference ?? '',
    'Duration (ms)': run.durationMs ?? '',
    'Run By': run.runBy || '',
    'Cashify URL': run.cashifyResult?.productUrl || '',
    Error: run.error || '',
    Note: run.cashifyResult?.note || '',
    'Quiz Payload (JSON)': JSON.stringify(quiz),
  };
}

export function serializeAgentTestRuns(runs) {
  return runs.map(serializeRun);
}

export function buildAgentTestRunsWorkbook(runs) {
  const rows = runs.map(runToExcelRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Agent Test Runs');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
