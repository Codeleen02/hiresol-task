
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectdb = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in .env.local");
  }

  await mongoose.connect(process.env.MONGODB_URL);
};

export default connectdb;
