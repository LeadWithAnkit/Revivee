import type { CompanionResponseContext, CompanionResponse } from "./responseProvider";

export function buildCompanionResponse(ctx: CompanionResponseContext): CompanionResponse {
  const { query, intent, context, knowledgeItems, intervention, patternStatement } = ctx;
  const q = query.toLowerCase();

  const topKnowledge = knowledgeItems[0];
  const evidenceBadge = topKnowledge ? {
    level: topKnowledge.evidenceLevel,
    source: topKnowledge.sourceIds[0] || "REVIVE Knowledge Base"
  } : { level: "HIGH", source: "REVIVE Behavioral Science" };

  // Personal context summary if available
  const obs = context.todayObs;
  const personalSummary = obs
    ? `(Today's log: ${obs.sleepHours}h sleep, ${obs.energy}/10 energy, ${obs.concentration}/10 focus)`
    : "";

  // 1. Navigation / App Features Intent
  if (intent === "APP_NAVIGATION" || q.includes("where") || q.includes("how to track")) {
    if (q.includes("mood") || q.includes("sleep") || q.includes("check-in") || q.includes("track")) {
      return {
        text: "You can track your daily energy, focus, sleep, hydration, and mood in the 'Daily check-in' tab.\n\nAll entries are stored 100% locally on your device in isolated browser storage.",
        evidenceBadge: { level: "HIGH", source: "REVIVE Privacy Architecture" },
        actionLabel: "Open Daily Check-in",
        actionType: "log-tracker"
      };
    }
    if (q.includes("calendar") || q.includes("patterns") || q.includes("progress")) {
      return {
        text: "You can view your monthly color-coded patterns and observations under 'Calendar' and statistical trends under 'Insights'.",
        evidenceBadge: { level: "HIGH", source: "REVIVE Analytics" },
        actionLabel: "View Calendar",
        actionType: "open-reset"
      };
    }
    return {
      text: "REVIVE is organized into 4 core daily pillars: Today's Dashboard, Daily Check-in, Focus Soundscapes/Timers, and Acute Reset tools.",
      evidenceBadge: { level: "HIGH", source: "REVIVE Guide" },
      actionLabel: "Go to Today",
      actionType: "open-reset"
    };
  }

  // 2. Productivity / Planning Intent
  if (intent === "PRODUCTIVITY" || q.includes("plan my next") || q.includes("what first")) {
    const focusTime = obs?.concentration ?? 6;
    return {
      text: `Let's break the next 3 hours into a low-friction structure. ${personalSummary}\n\n1. Block 1 (25m): Single high-priority task initiation.\n2. Rest (5m): Hydrate & step away.\n3. Block 2 (45m): Deep work with binaural audio.`,
      evidenceBadge: { level: "HIGH", source: "Cirillo / APA Practice Guidelines" },
      actionLabel: "Start 25-Min Focus Session",
      actionType: "start-25m"
    };
  }

  // 3. Ambiguous / Overwhelmed / Bad Day Intent
  if (intent === "AMBIGUOUS" || q === "help" || q === "bad day" || q === "nothing is working") {
    return {
      text: "When feeling stuck or overwhelmed, do not try to fix everything at once. Let's do a 60-second nervous system reset first.",
      evidenceBadge: { level: "HIGH", source: "Vagal Autonomic Regulation" },
      actionLabel: "Start 60s Box Breathing",
      actionType: "open-reset"
    };
  }

  // 4. "What should I do today?" / Daily Guidance
  if (q.includes("what should i do") || q.includes("do today") || intent === "GENERAL" && q.includes("today")) {
    const energy = obs?.energy ?? 5;
    let actionText = "";
    if (energy <= 4) {
      actionText = `Your logged energy is low today (${energy}/10). Start tiny: take 5 minutes to complete one micro-task. You don't need to push through exhaustion.`;
    } else if (energy <= 7) {
      actionText = `Your energy is moderate (${energy}/10). A 25-minute focused block with 40Hz audio is ideal right now.`;
    } else {
      actionText = `Your energy is high (${energy}/10)! This is a great window for a 45-minute deep focus block.`;
    }

    return {
      text: `${actionText}\n\nAction Step: ${intervention.name}\n${intervention.steps.slice(0, 2).map(s => `• ${s}`).join("\n")}`,
      evidenceBadge,
      actionLabel: intervention.actionLabel,
      actionType: intervention.actionType,
      interventionId: intervention.id
    };
  }

  // 5. Procrastination / Can't Study / Focus Crisis
  if (q.includes("can't study") || q.includes("cannot study") || q.includes("wasted") || q.includes("procrastinat") || q.includes("can't focus")) {
    return {
      text: `Procrastination is an emotional task-initiation response, not laziness. ${personalSummary}\n\nDon't try to save the entire day—just start for 5 minutes without pressure to finish.`,
      evidenceBadge: { level: "HIGH", source: "Psychological Bulletin (Steel, 2007)" },
      actionLabel: "Start 5-Minute Micro Timer",
      actionType: "start-5m",
      interventionId: intervention.id
    };
  }

  // 6. Dopamine & Reward Science
  if (intent === "DOPAMINE" || q.includes("dopamine")) {
    return {
      text: "Dopamine governs anticipation and reward prediction error, not pleasure. Social media doesn't 'deplete' your dopamine supply permanently; it alters immediate cue thresholds. Focus on reducing task initiation friction.",
      evidenceBadge: { level: "HIGH", source: "NIDA / Neurobiology Review" },
      actionLabel: "Try 5-Min Task Shrinking",
      actionType: "start-5m",
      cautionNotice: "Avoid self-diagnosing neurotransmitter levels or assigning shame to rest."
    };
  }

  // 7. Sleep & Rest Architecture
  if (intent === "SLEEP" || q.includes("sleep")) {
    const sleepInfo = obs
      ? `Today's recorded sleep: ${obs.sleepHours}h (Quality: ${obs.sleepQuality}/10).`
      : "You haven't logged today's sleep yet.";

    return {
      text: `${sleepInfo}\n\nConsistent sleep duration supports working memory and emotional resilience. Evidence suggests protecting an 8-hour sleep opportunity tonight and maintaining a steady morning wake window.`,
      evidenceBadge: { level: "HIGH", source: "CDC / Sleep Research Society" },
      actionLabel: "Log Sleep Check-in",
      actionType: "log-tracker"
    };
  }

  // 8. Default Knowledge-Backed Fallback Response
  if (topKnowledge) {
    return {
      text: `${topKnowledge.claim}\n\n${topKnowledge.explanation}\n\n${patternStatement ? `Personal Pattern: ${patternStatement}\n\n` : ""}Suggested Action:\n${topKnowledge.usefulActions.slice(0, 2).map(a => `• ${a}`).join("\n")}`,
      evidenceBadge,
      actionLabel: intervention.actionLabel,
      actionType: intervention.actionType,
      interventionId: intervention.id,
      cautionNotice: topKnowledge.caution
    };
  }

  return {
    text: "I'm here to help you take the next small action, review recorded patterns, or explore REVIVE's research.\n\nTry asking: 'I can't focus', 'Plan my next 3 hours', 'How was my sleep?', or 'What should I do today?'",
    evidenceBadge: { level: "HIGH", source: "REVIVE Companion" },
    actionLabel: "Start 5-Minute Timer",
    actionType: "start-5m"
  };
}

