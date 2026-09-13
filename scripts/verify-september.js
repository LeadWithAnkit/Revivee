import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

async function verify() {
  await mongoose.connect(MONGODB_URI);
  const Observation = mongoose.models.Observation || mongoose.model("Observation", new mongoose.Schema({}, { strict: false }));
  const StudySession = mongoose.models.StudySession || mongoose.model("StudySession", new mongoose.Schema({}, { strict: false }));

  const obs = await Observation.find({ date: "2026-09-01" });
  const sess = await StudySession.find({ date: "2026-09-01" });

  console.log("=== MONGODB ATLAS VERIFICATION ===");
  console.log("Found Observations for 2026-09-01:", obs.length);
  console.log(obs);
  console.log("Found Sessions for 2026-09-01:", sess.length);
  console.log(sess);
  await mongoose.disconnect();
}

verify();
