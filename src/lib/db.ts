import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/verdachain";

/**
 * Global cache for MongoDB connection.
 * Prevents multiple connections during Next.js hot-reloads in development.
 * Supports automatic retry after transient failures.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastAttempt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Retry cooldown: wait 10s between reconnection attempts after failure
const RETRY_COOLDOWN_MS = 10_000;

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  lastAttempt: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB with connection reuse and retry logic.
 * - Reuses existing connections (safe across hot-reloads)
 * - Retries after cooldown period on failure (not permanently blocked)
 * - Uses short timeout so the app doesn't hang when Mongo is down
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if already connected
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If a previous attempt failed, enforce cooldown before retrying
  if (!cached.promise && cached.lastAttempt > 0) {
    const elapsed = Date.now() - cached.lastAttempt;
    if (elapsed < RETRY_COOLDOWN_MS) {
      throw new Error(
        `MongoDB connection failed recently. Retrying in ${Math.ceil((RETRY_COOLDOWN_MS - elapsed) / 1000)}s.`
      );
    }
  }

  // Start a new connection if none is in progress
  if (!cached.promise) {
    cached.lastAttempt = Date.now();

    // Set mongoose options for App Router compatibility
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((conn) => {
        console.log("[VerdaChain] MongoDB connected successfully");
        return conn;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // Reset promise so future calls can retry after cooldown
    cached.promise = null;
    cached.conn = null;
    console.error("[VerdaChain] MongoDB connection failed:", e instanceof Error ? e.message : e);
    throw e;
  }
}

/**
 * Check if MongoDB is currently connected and healthy.
 */
export function isDBConnected(): boolean {
  return cached.conn !== null && cached.conn.connection.readyState === 1;
}
