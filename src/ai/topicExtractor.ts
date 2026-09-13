// Topic Extractor: Extracts key topic tokens and signals from user input

export function extractTopics(input: string): string[] {
  const q = input.toLowerCase();
  const topics: string[] = [];

  const map: Record<string, string[]> = {
    sleep: ["sleep", "tired", "insomnia", "awakening", "rest", "bedtime", "caffeine"],
    hydration: ["water", "thirst", "fluid", "urine", "dehydration"],
    nutrition: ["food", "eat", "meal", "diet", "protein", "vitamin", "heaviness"],
    focus: ["focus", "concentrate", "attention", "distract", "phone", "instagram"],
    procrastination: ["procrastinat", "wasted", "cannot start", "cant start", "postpone", "delay"],
    study: ["study", "active recall", "retrieval", "spacing", "exam", "revision", "remember"],
    cat: ["cat", "quant", "varc", "dilr", "mock", "error log"],
    dopamine: ["dopamine", "detox", "reward", "addiction", "habit"],
    stress: ["stress", "anxiety", "overwhelm", "pressure", "burnout"],
    patterns: ["pattern", "trend", "data", "history", "observations"]
  };

  Object.entries(map).forEach(([topic, keywords]) => {
    if (keywords.some(k => q.includes(k))) {
      topics.push(topic);
    }
  });

  return topics.length > 0 ? topics : ["general"];
}
