// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error(`MongoDB connection error: ${err.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

// Global cache variable across warm lambdas
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If a connection is already established, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection attempt is in-flight, start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if connection drops rather than hanging
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Reset promise so next request can retry
    console.error(`MongoDB connection error: ${err.message}`);
    throw err; // Throw error to let the Express middleware handle it instead of killing the process
  }

  return cached.conn;
};

export default connectDB;
