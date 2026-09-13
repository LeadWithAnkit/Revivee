import { connectToDatabase, User } from "./_db.js";

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(36) + "_" + Buffer.from(str).toString("base64").substring(0, 8);
}

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

  const { action } = req.query;

  if (req.method === "POST" && action === "signup") {
    const { name, identifier, password } = req.body || {};
    const trimmedId = (identifier || "").trim().toLowerCase();
    const trimmedName = (name || "").trim() || trimmedId.split("@")[0];

    if (!trimmedId) {
      return res.status(400).json({ success: false, error: "Please enter an email address or mobile number." });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, error: "Password must be at least 4 characters long." });
    }

    const existing = await User.findOne({ identifier: trimmedId });
    if (existing) {
      return res.status(400).json({ success: false, error: "An account with this email or mobile number already exists." });
    }

    const newUser = await User.create({
      id: "u_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      identifier: trimmedId,
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password)
    });

    const publicUser = {
      id: newUser.id,
      name: newUser.name,
      identifier: newUser.identifier,
      createdAt: newUser.createdAt
    };

    return res.status(200).json({ success: true, user: publicUser });
  }

  if (req.method === "POST" && action === "login") {
    const { identifier, password } = req.body || {};
    const trimmedId = (identifier || "").trim().toLowerCase();

    if (!trimmedId || !password) {
      return res.status(400).json({ success: false, error: "Please enter your email/phone and password." });
    }

    const found = await User.findOne({ identifier: trimmedId });
    if (!found) {
      return res.status(400).json({ success: false, error: "No account found with this email or mobile number." });
    }

    const targetHash = simpleHash(password);
    if (found.passwordHash !== targetHash) {
      return res.status(400).json({ success: false, error: "Incorrect password. Please try again." });
    }

    const publicUser = {
      id: found.id,
      name: found.name,
      identifier: found.identifier,
      createdAt: found.createdAt
    };

    return res.status(200).json({ success: true, user: publicUser });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
