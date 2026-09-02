import mongoose from 'mongoose';
import connectDB from '../config/db.js';

export function isMongoRetryableError(err) {
  const message = String(err?.message || '');
  // Never retry permanent write/query conflicts (e.g. $set + $setOnInsert same path).
  if (/would create a conflict|duplicate key|E11000|validation failed/i.test(message)) {
    return false;
  }
  return (
    err?.name === 'MongoNetworkError'
    || err?.name === 'MongoNotConnectedError'
    || err?.codeName === 'NotPrimaryNoSecondaryOk'
    || err?.codeName === 'HostUnreachable'
    || err?.codeName === 'NetworkTimeout'
    || /not connected|buffering timed out|connection closed|topology was destroyed|server selection timed out/i.test(message)
  );
}

export async function ensureDbReady() {
  if (mongoose.connection.readyState === 1) return true;
  return connectDB();
}

export async function withDbRetry(fn, { attempts = 4, delayMs = 750 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      await ensureDbReady();
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isMongoRetryableError(err) || i === attempts - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}
