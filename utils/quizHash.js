import crypto from 'crypto';

function stableSortObject(value) {
  if (value == null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(stableSortObject).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableSortObject(value[key]);
      return acc;
    }, {});
}

export function hashQuizPayload(quizPayload) {
  const normalized = stableSortObject(quizPayload || {});
  const { slug, ...rest } = normalized;
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(rest))
    .digest('hex')
    .slice(0, 32);
}
