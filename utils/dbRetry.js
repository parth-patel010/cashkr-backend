import mongoose from 'mongoose';
import connectDB from '../config/db.js';

export function isMongoRetryableError(err) {
  return (
    err?.name === 'MongoServerError'
    || err?.name === 'MongoNetworkError'
    || err?.name === 'MongoNotConnectedError'
    || err?.name === 'MongooseError'
    || /not connected|buffering timed out|connection closed|topology was destroyed/i.test(String(err?.message || ''))
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
