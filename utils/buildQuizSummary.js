function joinList(value) {
  if (!Array.isArray(value) || !value.length) return 'None';
  return value.join(', ');
}

function yesNo(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value == null || value === '' ? null : String(value);
}

export function buildQuizSummaryFromPayload(payload = {}, category) {
  const rows = [];
  if (!payload || typeof payload !== 'object') return rows;

  if (category === 'mobile') {
    if (payload.deviceAge) rows.push({ question: 'Device Age', answer: payload.deviceAge });
    const warranty = yesNo(payload.underWarranty);
    if (warranty) rows.push({ question: 'Under Warranty', answer: warranty });
    if (payload.eSIMSupport) {
      rows.push({
        question: 'SIM Type',
        answer: payload.eSIMSupport === 'esim_only_global'
          ? 'eSIM only (Global variant)'
          : 'Physical SIM + eSIM',
      });
    }
    const calls = yesNo(payload.ableToMakeCalls);
    if (calls) rows.push({ question: 'Able to Make Calls', answer: calls });
    const touch = yesNo(payload.isTouchScreenWorking);
    if (touch) rows.push({ question: 'Touch Screen Working', answer: touch });
    const screen = yesNo(payload.isScreenOriginal);
    if (screen) rows.push({ question: 'Original Screen', answer: screen });
    rows.push({ question: 'Physical Issues', answer: joinList(payload.physicalIssues) });
    rows.push({ question: 'Technical Issues', answer: joinList(payload.technicalIssues) });
    const accessories = payload.accessories || [];
    rows.push({
      question: 'Accessories',
      answer: Array.isArray(accessories) && accessories.length ? accessories.join(', ') : 'None',
    });
    return rows.filter((r) => String(r.answer ?? '').trim() !== '');
  }

  if (category === 'laptop' || category === 'mac') {
    if (payload.processor) rows.push({ question: 'Processor', answer: payload.processor });
    if (payload.ram) rows.push({ question: 'RAM', answer: payload.ram });
    if (payload.storage) rows.push({ question: 'Storage', answer: payload.storage });
    if (payload.powerStatus) {
      rows.push({
        question: 'Power Status',
        answer: payload.powerStatus === 'on' ? 'Turns On' : 'Does Not Turn On',
      });
    }
    if (payload.screenSize) rows.push({ question: 'Screen Size', answer: payload.screenSize });
    if (payload.hasTouchScreen === true) {
      rows.push({
        question: 'Touch Screen',
        answer: payload.isTouchScreenWorking ? 'Available (Working)' : 'Available (Not Working)',
      });
    } else if (payload.hasTouchScreen === false) {
      rows.push({ question: 'Touch Screen', answer: 'Not Available' });
    }
    if (payload.hasGpu === true || payload.hasDedicatedGpu === true) {
      rows.push({
        question: 'Graphic Card',
        answer: payload.isGpuWorking ? 'Dedicated (Working)' : 'Dedicated (Not Working)',
      });
    } else if (payload.hasGpu === false || payload.hasDedicatedGpu === false) {
      rows.push({ question: 'Graphic Card', answer: 'Not Available' });
    }
    rows.push({ question: 'Functional Issues', answer: joinList(payload.functionalIssues || payload.issuesList) });
    rows.push({ question: 'Screen Issues', answer: joinList(payload.screenIssues || payload.screenIssuesList) });
    rows.push({ question: 'Body Issues', answer: joinList(payload.bodyIssues || payload.bodyIssuesList) });
    rows.push({ question: 'Accessories', answer: joinList(payload.accessories) });
    if (payload.yearBracket || payload.age) {
      rows.push({ question: 'Device Age', answer: payload.yearBracket || payload.age });
    }
    return rows.filter((r) => String(r.answer ?? '').trim() !== '' && r.answer !== 'None');
  }

  return rows;
}
