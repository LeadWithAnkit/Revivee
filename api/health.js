import mongoose from "mongoose";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const uri = process.env.MONGODB_URI || "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

  try {
    if (!uri) {
      return res.status(200).json({
        status: "ok",
        mode: "local",
        connected: false,
        message: "No MONGODB_URI set in environment. Running with local IndexedDB persistence.",
        timestamp: new Date().toISOString()
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }

    return res.status(200).json({
      status: "ok",
      mode: "mongodb",
      connected: true,
      database: "Cluster0",
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(200).json({
      status: "ok",
      mode: "local",
      connected: false,
      error: error.message || "Connection failed",
      message: "MongoDB Atlas connection offline. Seamless fallback to IndexedDB local storage active.",
      timestamp: new Date().toISOString()
    });
  }
}
