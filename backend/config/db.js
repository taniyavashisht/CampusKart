import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error("MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  // connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let attempt = 0;
  const maxAttempts = 10;

  const connectWithRetry = async () => {
    attempt++;

    try {
      await mongoose.connect(MONGO_URI, opts);
      console.log("✅ MongoDB connected");

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB runtime error:", err);
      });

    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err.message);

      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Retrying to connect in ${delay}ms...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error("Max MongoDB connection attempts reached. Exiting.");
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

export default connectDB;
