import type { KnowledgeItem } from "./types";

export const nutritionKnowledge: KnowledgeItem[] = [
  {
    id: "hydration-thirst-context",
    domain: "hydration",
    topic: "fluid-needs",
    subtopic: "thirst-guided-intake",
    claim: "Fluid requirements are highly context-dependent; universal rigid daily water targets lack evidence.",
    explanation: "Fluid balance relies on ambient temperature, humidity, physical activity, diet, and physiological state. In healthy adults, physiological thirst and pale urine colour serve as reliable everyday indicators.",
    evidenceLevel: "HIGH",
    evidenceType: "guideline",
    population: "General Adult Population",
    relevantSignals: ["fluidLitres", "thirst", "urineColour", "urineFrequency"],
    relatedTopics: ["hydration", "physical-health"],
    usefulActions: [
      "Drink to quench natural thirst throughout the day.",
      "Observe urine color (aiming for pale straw) rather than forcing large liquid volumes."
    ],
    caution: "Unusual persistent thirst or excessive urination warrants medical evaluation rather than self-directed fluid loading.",
    sourceIds: ["NIH-ODS-HYDRATION", "NHS-NUTRITION-GUIDE"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "post-meal-somnolence",
    domain: "nutrition",
    topic: "digestion-energy",
    subtopic: "post-prandial-sleepiness",
    claim: "Post-meal heaviness and drowsiness are normal biological responses amplified by large meal size, high glycemic load, and underlying sleep debt.",
    explanation: "Postprandial somnolence involves parasympathetic activation ('rest and digest') and shifts in regional blood flow. Heavy or rapidly digestible carbohydrate meals can induce rapid glucose shifts.",
    evidenceLevel: "HIGH",
    evidenceType: "systematic-review",
    population: "Adults",
    relevantSignals: ["mealSize", "postMealHeaviness", "postMealSleepiness", "energy"],
    relatedTopics: ["digestion", "energy-management"],
    usefulActions: [
      "Moderate meal portion size before high-focus study sessions.",
      "Pair complex carbohydrates with adequate protein and fibre to steady energy absorption.",
      "Take a 5-minute light walking break post lunch."
    ],
    caution: "Intermittent mild post-meal sleepiness is physiological; severe disabling fatigue after meals should be evaluated by a healthcare professional.",
    sourceIds: ["NHS-NUTRITION-GUIDE"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "dietary-deficiencies-self-diagnosis-caution",
    domain: "nutrition",
    topic: "micronutrients",
    subtopic: "self-diagnosis-limitations",
    claim: "Common symptoms like tiredness or low focus have multiple overlapping causes; micronutrient deficiencies cannot be accurately self-diagnosed.",
    explanation: "Fatigue or brain fog can stem from sleep debt, stress, dehydration, lack of activity, or metabolic causes. Blood testing by a licensed medical provider is required before initiating high-dose supplementation.",
    evidenceLevel: "HIGH",
    evidenceType: "guideline",
    population: "General Adults",
    relevantSignals: ["energy", "concentration", "headache"],
    relatedTopics: ["nutrition-safety", "medical-disclaimer"],
    usefulActions: [
      "Focus on a varied, balanced diet rich in minimally processed whole foods.",
      "Discuss persistent physical fatigue with a doctor for proper diagnostic lab work."
    ],
    caution: "REVIVE does not recommend or prescribe dietary supplements. High doses of certain fat-soluble vitamins can cause toxicity.",
    sourceIds: ["NHS-NUTRITION-GUIDE", "WHO-SELFCARE-2026"],
    lastReviewed: "2026-09-01"
  }
];
