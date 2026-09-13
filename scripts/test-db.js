import mongoose from "mongoose";
import fs from "fs";

const MONGODB_URI = "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  fs.writeFileSync("db_result.txt", "SUCCESS: Connected to MongoDB Cluster0! State: " + mongoose.connection.readyState, "utf8");
  await mongoose.disconnect();
} catch (error) {
  fs.writeFileSync("db_result.txt", "FAILED: " + error.message, "utf8");
}
