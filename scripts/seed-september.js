import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

const ObservationSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  sleepHours: Number,
  sleepQuality: Number,
  awakenings: Number,
  daytimeSleepiness: Number,
  fluidLitres: Number,
  thirst: Number,
  urineFrequency: Number,
  urineColour: Number,
  unusualUrineSmell: Boolean,
  mealSize: String,
  postMealHeaviness: Number,
  postMealSleepiness: Number,
  appetite: String,
  energy: Number,
  headache: Boolean,
  muscleAches: Boolean,
  dryMouth: Boolean,
  tasteChanges: Boolean,
  toothSensation: Boolean,
  digestion: String,
  motivation: Number,
  concentration: Number,
  enjoyment: Number,
  emotionalEngagement: Number,
  studyStress: Number,
  escapeUrge: Number,
  phoneUrges: Number,
  focusedMinutes: Number,
  focusBlocks: Number,
  subjects: String,
  distractions: String,
  helped: String,
  notes: String
}, { timestamps: true });

const StudySessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  subject: String,
  topic: String,
  minutes: Number,
  focus: Number,
  distractions: Number,
  completed: Boolean,
  note: String
}, { timestamps: true });

const Observation = mongoose.models.Observation || mongoose.model("Observation", ObservationSchema);
const StudySession = mongoose.models.StudySession || mongoose.model("StudySession", StudySessionSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");

    const sep1Data = {
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
      distractions: "Minor phone notifications (handled)",
      helped: "60-second breathing pause & structured 25m Pomodoro blocks.",
      notes: "September Day 1 dummy entry created successfully for REVIVE test!"
    };

    const sep1Session = {
      id: "sep-1-session-1",
      date: "2026-09-01",
      subject: "Cognitive Psychology",
      topic: "Attention span & working memory recovery",
      minutes: 45,
      focus: 9,
      distractions: 1,
      completed: true,
      note: "High focus session on 1 September."
    };

    await Observation.findOneAndUpdate({ date: sep1Data.date }, sep1Data, { upsert: true, new: true });
    await StudySession.findOneAndUpdate({ id: sep1Session.id }, sep1Session, { upsert: true, new: true });

    console.log("SUCCESSS_TAG: September 1, 2026 dummy entry seeded successfully into MongoDB Atlas!");

    const retrievedObs = await Observation.findOne({ date: "2026-09-01" });
    const retrievedSess = await StudySession.findOne({ id: "sep-1-session-1" });

    console.log("\nRetrieved MongoDB Record:");
    console.log(JSON.stringify({ observation: retrievedObs, session: retrievedSess }, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding MongoDB:", err);
    process.exit(1);
  }
}

seed();
