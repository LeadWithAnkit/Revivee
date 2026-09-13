import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ankitkumartiwari8360_db_user:sJjLjnnbCzQ977gb@cluster0.e0usepo.mongodb.net/?appName=Cluster0";

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  return mongoose.connection;
}

// User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  identifier: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

// Observation Schema
const ObservationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  sleepHours: Number,
  sleepQuality: Number,
  awakenings: Number,
  daytimeSleepiness: Number,
  walkKm: Number,
  pushups: Number,
  sunlightMinutes: Number,
  mobilityMinutes: Number,
  cardioMinutes: Number,
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
  eyeFatigue: Boolean,
  somaticFatigue: Boolean,
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
ObservationSchema.index({ userId: 1, date: 1 }, { unique: true });

// Study Session Schema
const StudySessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  id: { type: String, required: true },
  date: String,
  subject: String,
  topic: String,
  minutes: Number,
  focus: Number,
  distractions: Number,
  completed: Boolean,
  note: String
}, { timestamps: true });
StudySessionSchema.index({ userId: 1, id: 1 }, { unique: true });

// Intervention Schema
const InterventionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  id: { type: String, required: true },
  date: String,
  intervention: String,
  context: String,
  before: Number,
  after: Number,
  helpfulness: Number
}, { timestamps: true });
InterventionSchema.index({ userId: 1, id: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Observation = mongoose.models.Observation || mongoose.model("Observation", ObservationSchema);
export const StudySession = mongoose.models.StudySession || mongoose.model("StudySession", StudySessionSchema);
export const Intervention = mongoose.models.Intervention || mongoose.model("Intervention", InterventionSchema);
