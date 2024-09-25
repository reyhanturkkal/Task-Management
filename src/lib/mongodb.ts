import mongoose from 'mongoose';

async function connectMongo() {
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URL!).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;
