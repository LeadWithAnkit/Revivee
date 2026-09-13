import mongoose from "mongoose";
import fs from "fs";

const MONGODB_URI = "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  
  const ObservationSchema = new mongoose.Schema({}, { strict: false });
  const StudySessionSchema = new mongoose.Schema({}, { strict: false });

  const Observation = mongoose.models.Observation || mongoose.model("Observation", ObservationSchema);
  const StudySession = mongoose.models.StudySession || mongoose.model("StudySession", StudySessionSchema);

  // Insert dummy entry for 2026-09-01
  const sep1Obs = await Observation.findOneAndUpdate(
    { date: "2026-09-01" },
    {
      date: "2026-09-01",
      sleepHours: 7.5,
      sleepQuality: 8,
      awakenings: 0,
      daytimeSleepiness: 3,
      fluidLitres: 2.8,
      thirst: 4,
      urineFrequency: 5,
      urineColour: 2,
      unusualUrineSmell: false,
      mealSize: "normal",
      postMealHeaviness: 3,
      postMealSleepiness: 3,
      appetite: "normal",
      energy: 8,
      headache: false,
      muscleAches: false,
      dryMouth: false,
      tasteChanges: false,
      toothSensation: false,
      digestion: "Smooth energy after balanced lunch.",
      motivation: 8,
      concentration: 9,
      enjoyment: 8,
      emotionalEngagement: 7,
      studyStress: 3,
      escapeUrge: 2,
      phoneUrges: 2,
      focusedMinutes: 120,
      focusBlocks: 3,
      subjects: "Cognitive Science & React Architecture",
      distractions: "Minor phone notifications",
      helped: "60-second breathing pause & 25m Pomodoro blocks.",
      notes: "September Day 1 dummy entry created successfully for REVIVE test!"
    },
    { upsert: true, new: true }
  );

  const sep1Sess = await StudySession.findOneAndUpdate(
    { id: "sep-1-session-1" },
    {
      id: "sep-1-session-1",
      date: "2026-09-01",
      subject: "Cognitive Psychology",
      topic: "Attention span & working memory recovery",
      minutes: 45,
      focus: 9,
      distractions: 1,
      completed: true,
      note: "High focus session on 1 September."
    },
    { upsert: true, new: true }
  );

  const allObs = await Observation.find({}).lean();
  const allSess = await StudySession.find({}).lean();

  const report = {
    status: "SUCCESS",
    mongodbConnected: mongoose.connection.readyState === 1,
    databaseName: mongoose.connection.name || "Cluster0",
    insertedSeptemberObservation: sep1Obs,
    insertedSeptemberSession: sep1Sess,
    totalObservationsInDB: allObs.length,
    totalSessionsInDB: allSess.length,
    allObservations: allObs
  };

  fs.writeFileSync("db_verified.json", JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote report to db_verified.json");
  await mongoose.disconnect();
}

run();
