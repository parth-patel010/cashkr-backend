/**
 * In-memory valuation status while Cashify runs.
 * Lets status polling succeed even if Mongo blips during Playwright (admin test never polls DB).
 */
const runs = new Map();
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function prune() {
  const now = Date.now();
  for (const [id, run] of runs) {
    if (now - (run.updatedAt || 0) > MAX_AGE_MS) runs.delete(id);
  }
}

export function setValuationRun(recordId, patch = {}) {
  if (!recordId) return;
  prune();
  const id = String(recordId);
  const prev = runs.get(id) || {};
  runs.set(id, {
    ...prev,
    ...patch,
    recordId: id,
    updatedAt: Date.now(),
  });
}

export function getValuationRun(recordId) {
  if (!recordId) return null;
  prune();
  return runs.get(String(recordId)) || null;
}

export function mergeValuationRun(recordId, record = {}) {
  const mem = getValuationRun(recordId);
  if (!mem) return record;
  return { ...record, ...mem, _id: record._id || recordId };
}
