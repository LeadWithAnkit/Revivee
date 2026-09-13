export type Evidence = "strong" | "plausible" | "association" | "uncertain";

export const evidenceMeta: Record<Evidence, {label: string; tone: string}> = {
  strong: { label: "Established / stronger evidence", tone: "strong" },
  plausible: { label: "Reasonable possibility", tone: "plausible" },
  association: { label: "Association — not causation", tone: "association" },
  uncertain: { label: "Uncertain / needs context", tone: "uncertain" }
};

export const researchCards = [
  {
    id: "sleep",
    title: "Sleep",
    summary: "Short or fragmented sleep can overlap with daytime sleepiness, concentration difficulty and reduced emotional energy.",
    evidence: "strong" as Evidence,
    monitor: ["sleep duration", "awakenings", "sleep quality", "daytime sleepiness"]
  },
  {
    id: "hydration",
    title: "Hydration",
    summary: "Thirst, fluid intake, urination and urine colour are useful observations. A fixed large-water target should not be treated as a universal prescription.",
    evidence: "plausible" as Evidence,
    monitor: ["thirst", "fluid estimate", "urination", "urine colour"]
  },
  {
    id: "digestion",
    title: "Food & digestion",
    summary: "Post-meal heaviness and sleepiness are common experiences and can be amplified by meal size, timing and sleep debt.",
    evidence: "strong" as Evidence,
    monitor: ["meal size", "meal time", "heaviness", "post-meal sleepiness"]
  },
  {
    id: "attention",
    title: "Attention & initiation",
    summary: "Difficulty starting, switching tabs and escaping difficult work can form a behavioral loop without implying a diagnosis.",
    evidence: "plausible" as Evidence,
    monitor: ["start friction", "distractions", "escape urge", "task difficulty"]
  },
  {
    id: "emotion",
    title: "Emotional awareness",
    summary: "Alexithymia is a dimensional construct about identifying and describing feelings; it should not be self-diagnosed from a single experience.",
    evidence: "strong" as Evidence,
    monitor: ["emotional engagement", "ability to name feelings", "enjoyment"]
  }
];

export const problems = [
  {
    id: "focus",
    title: "Focus",
    icon: "focus",
    description: "Difficulty starting or staying with a task.",
    contributors: ["Sleep", "Stress", "Task difficulty", "Environment", "Phone reinforcement", "Physical state"],
    interventions: ["Reduce task size", "Start for 5 minutes", "Capture distractions", "Change environment", "Brief movement"]
  },
  {
    id: "sleep",
    title: "Sleep",
    icon: "sleep",
    description: "Duration, fragmentation and daytime sleepiness.",
    contributors: ["Sleep timing", "Awakenings", "Stress", "Environment", "Routine"],
    interventions: ["Track a consistent window", "Reduce late stimulation", "Record awakenings", "Review daytime sleepiness"]
  },
  {
    id: "thirst",
    title: "Thirst",
    icon: "water",
    description: "Observe thirst and fluid patterns without chasing a fixed litre target.",
    contributors: ["Fluid intake", "Heat/activity", "Mouth breathing", "Other physical factors"],
    interventions: ["Drink to thirst", "Spread fluids through the day", "Track pattern", "Discuss persistent symptoms clinically"]
  },
  {
    id: "study-stress",
    title: "Study stress",
    icon: "stress",
    description: "Pressure that can make starting or continuing work harder.",
    contributors: ["Unclear next step", "Task difficulty", "Avoidance", "Self-judgment"],
    interventions: ["Define one visible step", "5-minute start", "Reset", "Reduce task scope"]
  }
];

export const mindNodes = [
  { id: "sleep", x: 18, y: 22, title: "Sleep", sub: "duration · quality · awakenings", category: "physical", tone: "blue" },
  { id: "hydration", x: 18, y: 55, title: "Hydration", sub: "thirst · fluids · urine", category: "physical", tone: "blue" },
  { id: "nutrition", x: 18, y: 82, title: "Food & digestion", sub: "meal size · heaviness", category: "physical", tone: "blue" },
  { id: "physical", x: 42, y: 50, title: "Physical state", sub: "energy · body signals", category: "physical", tone: "blue" },
  { id: "attention", x: 50, y: 22, title: "Attention & focus", sub: "starting · staying · switching", category: "cognitive", tone: "violet" },
  { id: "avoidance", x: 65, y: 52, title: "Phone & avoidance", sub: "escape · stimulation", category: "cognitive", tone: "violet" },
  { id: "mood", x: 78, y: 26, title: "Mood & motivation", sub: "enjoyment · engagement", category: "emotional", tone: "violet" },
  { id: "stress", x: 82, y: 78, title: "Study stress", sub: "pressure · feedback loop", category: "emotional", tone: "violet" },
  { id: "alex", x: 88, y: 50, title: "Emotional awareness", sub: "affect labeling", category: "emotional", tone: "neutral" }
];

export const mindEdges = [
  ["sleep", "physical", "may influence", "strong"],
  ["hydration", "physical", "overlaps with", "association"],
  ["nutrition", "physical", "may interact", "plausible"],
  ["physical", "attention", "supports alertness", "strong"],
  ["attention", "avoidance", "can trigger", "plausible"],
  ["avoidance", "stress", "can reinforce", "plausible"],
  ["stress", "sleep", "may disrupt", "uncertain"],
  ["mood", "attention", "may influence", "plausible"],
  ["alex", "mood", "can relate to", "association"],
  ["nutrition", "mood", "may affect", "plausible"],
  ["stress", "mood", "can dampen", "plausible"]
] as const;

export const catTopics = [
  { subject: "Quant", topic: "Arithmetic", status: "Start", confidence: 2 },
  { subject: "Quant", topic: "Algebra", status: "Start", confidence: 1 },
  { subject: "Quant", topic: "Geometry", status: "Start", confidence: 1 },
  { subject: "DILR", topic: "Arrangements", status: "Start", confidence: 2 },
  { subject: "DILR", topic: "Tables & Graphs", status: "Start", confidence: 2 },
  { subject: "VARC", topic: "Reading Comprehension", status: "Start", confidence: 3 },
  { subject: "VARC", topic: "Para Jumbles", status: "Start", confidence: 1 }
];

export const learnItems = [
  {title: "Attention", body: "Attention is easier to protect when the next action is clear and environmental friction is low.", tag: "behavioral UX"},
  {title: "Avoidance loops", body: "When a task feels difficult, switching to an easier stimulus can provide immediate relief. Logging the trigger helps you experiment with smaller starts.", tag: "behavior"},
  {title: "Sleep", body: "Use your own sleep duration, quality and daytime sleepiness as observations. Do not turn one night into a conclusion.", tag: "self-observation"},
  {title: "Post-meal sleepiness", body: "Track meal size, timing and sleepiness together before deciding that a particular food or mechanism explains the pattern.", tag: "experiment"},
  {title: "Alexithymia", body: "A dimensional construct involving difficulty identifying or describing emotions. It is not a simple yes/no diagnosis.", tag: "education"},
  {title: "Executive friction", body: "A task can be objectively simple but still hard to initiate. Reducing the first step is a practical experiment.", tag: "study"}
];
