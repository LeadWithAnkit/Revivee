// Safety Engine: Checks for acute emergencies, severe symptoms, and crisis indicators

export interface SafetyCheckResult {
  isEmergency: boolean;
  message?: string;
  escalationType?: "medical-emergency" | "crisis-helpline" | "clinical-referral";
}

export function checkSafety(input: string): SafetyCheckResult {
  const q = input.toLowerCase();

  // Severe Mental Health Crisis / Self-Harm Detection
  const crisisKeywords = [
    "suicide", "want to die", "end my life", "harm myself", "cant go on", 
    "can't go on", "no reason to live", "hopeless", "self harm", "hurt myself"
  ];
  if (crisisKeywords.some(k => q.includes(k))) {
    return {
      isEmergency: true,
      escalationType: "crisis-helpline",
      message: `I hear how much distress you're carrying right now. Please know you do not have to carry this alone.

If you are in immediate danger or distress, please reach out to trusted emergency support right away:

• International Crisis Lines: Find a local helpline at https://findahelpline.com
• In India: Tele-MANAS (14416 / 1800-891-4416) or AASRA (91-9820466726)
• In US/Canada: Call or text 988 (988 Suicide & Crisis Lifeline)
• In UK: Call 111 (NHS) or 116 123 (Samaritans)

REVIVE is a personal self-observation tool and cannot replace immediate professional human care. Please connect with someone who can support you today.`
    };
  }

  // Physical Medical Emergencies
  const medicalKeywords = [
    "chest pain", "can't breathe", "cannot breathe", "shortness of breath", 
    "fainting", "passed out", "sudden paralysis", "severe allergic reaction", 
    "coughing blood", "slurred speech", "numbness on one side"
  ];
  if (medicalKeywords.some(k => q.includes(k))) {
    return {
      isEmergency: true,
      escalationType: "medical-emergency",
      message: `The symptoms you described (such as chest pain, breathing difficulty, or sudden weakness) can indicate a serious medical emergency.

Please seek immediate emergency medical care:
• Call your local emergency medical service (e.g., 112, 911, 999) immediately.
• Do not rely on self-tracking apps for urgent physical symptoms.`
    };
  }

  return { isEmergency: false };
}
