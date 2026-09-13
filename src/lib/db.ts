import { auth } from "./auth";

export type Observation = {
  date: string;
  sleepHours: number;
  sleepQuality: number;
  awakenings: number;
  daytimeSleepiness: number;
  walkKm?: number;
  pushups?: number;
  sunlightMinutes?: number;
  mobilityMinutes?: number;
  cardioMinutes?: number;
  fluidLitres: number;
  thirst: number;
  urineFrequency: number;
  urineColour: number;
  unusualUrineSmell: boolean;
  mealSize: "light" | "normal" | "large";
  postMealHeaviness: number;
  postMealSleepiness: number;
  appetite: "low" | "normal" | "high";
  energy: number;
  headache: boolean;
  muscleAches: boolean;
  dryMouth: boolean;
  eyeFatigue?: boolean;
  somaticFatigue?: boolean;
  tasteChanges: boolean;
  toothSensation: boolean;
  digestion: string;
  motivation: number;
  concentration: number;
  enjoyment: number;
  emotionalEngagement: number;
  studyStress: number;
  escapeUrge: number;
  phoneUrges: number;
  focusedMinutes: number;
  focusBlocks: number;
  subjects: string;
  distractions: string;
  helped: string;
  notes: string;
};

export type StudySession = {
  id: string;
  date: string;
  subject: string;
  topic: string;
  minutes: number;
  focus: number;
  distractions: number;
  completed: boolean;
  note: string;
};

export type InterventionResult = {
  id: string;
  date: string;
  intervention: string;
  context: string;
  before: number;
  after: number;
  helpfulness: number;
};

const DB_VERSION = 1;
const stores = ["observations", "sessions", "interventions", "settings"];

function openDb(): Promise<IDBDatabase> {
  const dbName = "revive-db-" + auth.getActiveUserId();
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      stores.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: s === "settings" ? "key" : s === "observations" ? "date" : "id" });
        }
      });
    };
    req.onsuccess = () => {
      // Request browser persistent storage protection
      if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
      }
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

async function putLocal<T>(store: string, value: T) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

const defaultSeptemberObs: Observation = {
  date: "2026-09-01",
  sleepHours: 7.5,
  sleepQuality: 8,
  awakenings: 0,
  daytimeSleepiness: 3,
  walkKm: 3.5,
  pushups: 25,
  sunlightMinutes: 20,
  mobilityMinutes: 15,
  cardioMinutes: 0,
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
  eyeFatigue: false,
  somaticFatigue: false,
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
};

const defaultSeptemberSess: StudySession = {
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

async function allLocal<T>(store: string): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = async () => { 
      db.close(); 
      const res = req.result as T[];
      if (res.length === 0 && store === "observations") {
        await putLocal("observations", defaultSeptemberObs);
        await putLocal("sessions", defaultSeptemberSess);
        resolve([defaultSeptemberObs as unknown as T]);
      } else {
        resolve(res); 
      }
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export type ConnectionStatus = {
  mode: "mongodb" | "local";
  connected: boolean;
  message: string;
  database?: string;
  error?: string;
};

export async function checkConnectionStatus(): Promise<ConnectionStatus> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("/api/health", { 
      method: "GET", 
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data.connected && data.mode === "mongodb") {
        return {
          mode: "mongodb",
          connected: true,
          message: `Connected to MongoDB (${data.database || "Cluster0"})`,
          database: data.database || "Cluster0"
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    mode: "local",
    connected: true,
    message: "Local Storage Active (IndexedDB)",
    database: "IndexedDB"
  };
}

// API Sync Helpers
async function syncApiPost<T>(endpoint: string, payload: T): Promise<boolean> {
  try {
    const userId = auth.getActiveUserId();
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(payload as Record<string, unknown>), userId })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function syncApiGet<T>(endpoint: string): Promise<T[] | null> {
  try {
    const userId = auth.getActiveUserId();
    const res = await fetch(`${endpoint}?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data as T[];
      }
    }
  } catch {
    // fallback to local
  }
  return null;
}

export const db = {
  putObservation: async (v: Observation) => {
    await putLocal("observations", v);
    await syncApiPost("/api/observations", v);
  },
  getObservations: async () => {
    const remote = await syncApiGet<Observation>("/api/observations");
    if (remote && remote.length > 0) return remote;
    return allLocal<Observation>("observations");
  },
  putSession: async (v: StudySession) => {
    await putLocal("sessions", v);
    await syncApiPost("/api/sessions", v);
  },
  getSessions: async () => {
    const remote = await syncApiGet<StudySession>("/api/sessions");
    if (remote && remote.length > 0) return remote;
    return allLocal<StudySession>("sessions");
  },
  putIntervention: async (v: InterventionResult) => {
    await putLocal("interventions", v);
    await syncApiPost("/api/interventions", v);
  },
  getInterventions: async () => {
    const remote = await syncApiGet<InterventionResult>("/api/interventions");
    if (remote && remote.length > 0) return remote;
    return allLocal<InterventionResult>("interventions");
  },
  setSetting: (key: string, value: unknown) => putLocal("settings", { key, value }),
  getSettings: () => allLocal<{ key: string; value: unknown }>("settings"),
  checkConnectionStatus,
  exportAll: async () => ({
    observations: await allLocal<Observation>("observations"),
    sessions: await allLocal<StudySession>("sessions"),
    interventions: await allLocal<InterventionResult>("interventions"),
    settings: await allLocal<{ key: string; value: unknown }>("settings")
  }),
  importAll: async (data: { observations?: Observation[]; sessions?: StudySession[]; interventions?: InterventionResult[]; settings?: { key: string; value: unknown }[] }) => {
    for (const x of data.observations ?? []) {
      await putLocal("observations", x);
      await syncApiPost("/api/observations", x);
    }
    for (const x of data.sessions ?? []) {
      await putLocal("sessions", x);
      await syncApiPost("/api/sessions", x);
    }
    for (const x of data.interventions ?? []) {
      await putLocal("interventions", x);
      await syncApiPost("/api/interventions", x);
    }
    for (const x of data.settings ?? []) await putLocal("settings", x);
  },
  clearAll: async () => {
    const dbInstance = await openDb();
    return new Promise<void>((resolve, reject) => {
      const tx = dbInstance.transaction(["observations", "sessions", "interventions", "settings"], "readwrite");
      tx.objectStore("observations").clear();
      tx.objectStore("sessions").clear();
      tx.objectStore("interventions").clear();
      tx.objectStore("settings").clear();
      tx.oncomplete = () => { dbInstance.close(); resolve(); };
      tx.onerror = () => { dbInstance.close(); reject(tx.error); };
    });
  }
};
