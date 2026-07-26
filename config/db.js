import mongoose from 'mongoose';

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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await dropLegacyConversationUserUnique();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
