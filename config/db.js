import mongoose from 'mongoose';

const RECONNECT_DELAY_MS = 30_000;
const MAX_ATTEMPTS = 5;

let reconnectTimer = null;
let connectInFlight = null;
let hadSuccessfulConnection = false;

export function resolveMongoUri() {
  const raw = process.env.MONGO_URI || process.env.MONGODB_URI || '';
  return String(raw).trim().replace(/^['"]|['"]$/g, '');
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDbStatusLabel() {
  const labels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return labels[mongoose.connection.readyState] || 'unknown';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dropLegacyConversationUserUnique = async () => {
  try {
    const col = mongoose.connection.collection('conversations');
    const indexes = await col.indexes();
    for (const idx of indexes) {
      const keys = Object.keys(idx.key || {});
      if (idx.unique && keys.length === 1 && keys[0] === 'userId') {
        await col.dropIndex(idx.name);
        console.log(`Dropped legacy unique index ${idx.name} on conversations.userId`);
      }
    }
  } catch (err) {
    if (!/index not found/i.test(String(err?.message || ''))) {
      console.warn('Conversation index cleanup:', err.message);
    }
  }
};

function authHint(message) {
  if (/bad auth|authentication failed/i.test(message)) {
    return ' (check Atlas username/password in MONGO_URI and reset the DB user if needed)';
  }
  if (/whitelist|timed out|server selection/i.test(message)) {
    return ' (check Atlas Network Access IP whitelist)';
  }
  return '';
}

function scheduleReconnect(uri) {
  if (reconnectTimer || connectInFlight) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (isDbConnected()) return;
    console.log('Retrying MongoDB connection…');
    await connectDB();
  }, RECONNECT_DELAY_MS);
}

function attachConnectionEvents(uri) {
  if (mongoose.connection.__devicekartEventsAttached) return;
  mongoose.connection.__devicekartEventsAttached = true;

  mongoose.connection.on('disconnected', () => {
    if (!hadSuccessfulConnection) return;
    console.warn('MongoDB disconnected — scheduling reconnect');
    scheduleReconnect(uri);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
}

async function attemptConnect(uri) {
  if (isDbConnected()) return true;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15_000,
        socketTimeoutMS: 60_000,
        maxPoolSize: 20,
        minPoolSize: 2,
        heartbeatFrequencyMS: 10_000,
        retryWrites: true,
      });
      hadSuccessfulConnection = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      await dropLegacyConversationUserUnique();
      return true;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}${authHint(error.message)}`);
      if (attempt < MAX_ATTEMPTS) {
        await sleep(2000 * attempt);
      }
    }
  }

  return false;
}

const connectDB = async ({ exitOnFailure = false } = {}) => {
  if (connectInFlight) return connectInFlight;

  connectInFlight = (async () => {
    const uri = resolveMongoUri();
    if (!uri) {
      console.error('❌ MongoDB URI missing. Set MONGO_URI (or MONGODB_URI) in .env');
      if (exitOnFailure) process.exit(1);
      return false;
    }

    attachConnectionEvents(uri);

    const connected = await attemptConnect(uri);
    if (connected) return true;

    console.error('❌ MongoDB unavailable. Server will keep running and retry in the background.');
    scheduleReconnect(uri);
    if (exitOnFailure) process.exit(1);
    return false;
  })();

  try {
    return await connectInFlight;
  } finally {
    connectInFlight = null;
  }
};

export default connectDB;
