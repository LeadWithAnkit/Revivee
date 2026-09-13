import { connectToDatabase, Intervention } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
  } catch (err) {
    return res.status(500).json({ success: false, error: "Database connection failed: " + err.message });
  }

  const userId = req.query.userId || req.body?.userId || "guest_default";

  if (req.method === "GET") {
    const docs = await Intervention.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: docs });
  }

  if (req.method === "POST") {
    const intervention = req.body || {};
    if (!intervention.id) {
      intervention.id = crypto.randomUUID();
    }

    const updated = await Intervention.findOneAndUpdate(
      { userId, id: intervention.id },
      { ...intervention, userId },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
