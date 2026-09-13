// Intent Detector: Classifies user input into REVIVE companion internal intent modes

export type IntentMode = 
  | "UNDERSTAND"
  | "RESET"
  | "FOCUS"
  | "STUDY"
  | "HEALTH"
  | "NUTRITION"
  | "SLEEP"
  | "MIND"
  | "MOTIVATION"
  | "DOPAMINE"
  | "DISTRACTION"
  | "PRODUCTIVITY"
  | "APP_NAVIGATION"
  | "AMBIGUOUS"
  | "CAT"
  | "GENERAL";

export function detectIntent(input: string): IntentMode {
  const q = input.toLowerCase().trim();

  if (q === "help" || q === "bad day" || q === "nothing is working" || q === "stuck") {
    return "AMBIGUOUS";
  }

  if (q.includes("where") || q.includes("how to track") || q.includes("how do i") || q.includes("where is") || q.includes("calendar") || q.includes("settings")) {
    return "APP_NAVIGATION";
  }

  if (q.includes("plan") || q.includes("next 3 hours") || q.includes("what first") || q.includes("schedule") || q.includes("priority")) {
    return "PRODUCTIVITY";
  }

  if (q.includes("cat") || q.includes("quant") || q.includes("varc") || q.includes("dilr") || q.includes("mock") || q.includes("error log")) {
    return "CAT";
  }
  if (q.includes("dopamine") || q.includes("detox") || q.includes("reward") || q.includes("spike")) {
    return "DOPAMINE";
  }
  if (q.includes("distract") || q.includes("instagram") || q.includes("phone") || q.includes("app") || q.includes("tab")) {
    return "DISTRACTION";
  }
  if (q.includes("sleep") || q.includes("tired") || q.includes("insomnia") || q.includes("nap") || q.includes("bedtime") || q.includes("caffeine") || q.includes("slept")) {
    return "SLEEP";
  }
  if (q.includes("eat") || q.includes("food") || q.includes("water") || q.includes("thirst") || q.includes("diet") || q.includes("vitamin") || q.includes("supplement") || q.includes("meal")) {
    return "NUTRITION";
  }
  if (q.includes("headache") || q.includes("digestion") || q.includes("fatigue") || q.includes("physical") || q.includes("dehydrat")) {
    return "HEALTH";
  }
  if (q.includes("study") || q.includes("revise") || q.includes("remember") || q.includes("retain") || q.includes("active recall") || q.includes("exam")) {
    return "STUDY";
  }
  if (q.includes("focus") || q.includes("concentrat") || q.includes("attention") || q.includes("can't focus") || q.includes("cant focus")) {
    return "FOCUS";
  }
  if (q.includes("reset") || q.includes("wasted") || q.includes("overwhelmed") || q.includes("calm down") || q.includes("postponing") || q.includes("procrastinat")) {
    return "RESET";
  }
  if (q.includes("mood") || q.includes("stress") || q.includes("anxious") || q.includes("stressed") || q.includes("feeling") || q.includes("unmotivated") || q.includes("alexithymia")) {
    return "MIND";
  }
  if (q.includes("pattern") || q.includes("today") || q.includes("data") || q.includes("how was") || q.includes("week") || q.includes("log")) {
    return "UNDERSTAND";
  }

  return "GENERAL";
}

