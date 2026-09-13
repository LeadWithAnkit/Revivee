import type { CompanionResponseContext, CompanionResponse } from "./responseProvider";

export function buildCompanionResponse(ctx: CompanionResponseContext): CompanionResponse {
  const { query, intent, context, knowledgeItems, intervention, patternStatement } = ctx;
  const q = query.toLowerCase();

  const topKnowledge = knowledgeItems[0];
  const evidenceBadge = topKnowledge ? {
    level: topKnowledge.evidenceLevel,
    source: topKnowledge.sourceIds[0] || "REVIVE Knowledge"
  } : { level: "HIGH", source: "REVIVE Guide" };

  // 1. "What should I do today?" / "What should I do now?" Engine
  if (q.includes("what should i do") || q.includes("do today") || intent === "GENERAL" && q.includes("today")) {
    const energy = context.todayObs?.energy ?? 5;
    let actionText = "";
    if (energy <= 4) {
      actionText = "Your logged energy is lower today. Let's make starting tiny: take 5 minutes and solve 1 basic question or review 1 error entry. You do not need to finish a long block.";
    } else if (energy <= 7) {
      actionText = "Your energy is moderate. A 20–30 minute focused session with a single clear output is recommended.";
    } else {
      actionText = "Your energy is high! This is a great window for a 45-minute deep focus session or problem set analysis.";
    }

    return {
      text: `${actionText}\n\nSuggested Action: ${intervention.name}\n${intervention.steps.map(s => `• ${s}`).join("\n")}`,
      evidenceBadge,
      actionLabel: intervention.actionLabel,
      actionType: intervention.actionType,
      interventionId: intervention.id
    };
  }

  // 2. Procrastination / Can't Study / Wasted Day
  if (q.includes("can't study") || q.includes("cannot study") || q.includes("wasted") || q.includes("procrastinat")) {
    return {
      text: `Don't try to recover the whole day. Let's recover the next 5 minutes.\n\nProcrastination is an emotional regulation response to task initiation pressure or uncertainty—not laziness.\n\nTry this 5-minute start:\n${intervention.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      evidenceBadge: { level: "HIGH", source: "PubMed / Psychological Bulletin" },
      actionLabel: intervention.actionLabel,
      actionType: intervention.actionType,
      interventionId: intervention.id
    };
  }

  // 3. Dopamine Queries & Debunking
  if (q.includes("dopamine")) {
    return {
      text: `Dopamine is primarily a neurotransmitter of anticipation, motivation, and reward prediction error—not a raw pleasure chemical.\n\nInternet health claims that social media 'depletes' or 'destroys' your dopamine supply are simplified myths. Procrastination or screen checking reflects competing incentive cues and environment friction.\n\nRather than attempting extreme 'dopamine detoxes', shrink task friction and structure small progress micro-milestones.`,
      evidenceBadge: { level: "HIGH", source: "National Institute on Drug Abuse (NIDA)" },
      actionLabel: "Try 5-Min Task Shrinking",
      actionType: "start-5m",
      cautionNotice: "Dopamine levels cannot be self-diagnosed and should not be used to assign shame to rest."
    };
  }

  // 4. Sleep & Fatigue
  if (intent === "SLEEP" || q.includes("sleep")) {
    const sleepInfo = context.todayObs
      ? `Today's recorded sleep: ${context.todayObs.sleepHours}h (Quality: ${context.todayObs.sleepQuality}/10).`
      : "You haven't logged today's sleep yet.";

    return {
      text: `${sleepInfo}\n\nAdults generally require 7+ hours of consistent sleep for optimal working memory and focus. Shifting sleep-wake schedules shifts biological clocks, causing daytime tiredness.\n\n${patternStatement ? `Personal Pattern: ${patternStatement}\n\n` : ""}Next step: Maintain a consistent wake-up window and protect an 8-hour sleep opportunity tonight.`,
      evidenceBadge: { level: "HIGH", source: "CDC / NICE Guidelines" },
      actionLabel: "Log Daily Check-in",
      actionType: "log-tracker"
    };
  }

  // 5. Default Knowledge-Backed Response
  if (topKnowledge) {
    return {
      text: `${topKnowledge.claim}\n\n${topKnowledge.explanation}\n\n${patternStatement ? `Personal Pattern: ${patternStatement}\n\n` : ""}Suggested Action:\n${topKnowledge.usefulActions.map(a => `• ${a}`).join("\n")}`,
      evidenceBadge,
      actionLabel: intervention.actionLabel,
      actionType: intervention.actionType,
      interventionId: intervention.id,
      cautionNotice: topKnowledge.caution
    };
  }

  return {
    text: `I'm here to help you decide the next small action, interpret your recorded patterns, or navigate REVIVE's research base.\n\nTry asking: "I can't study", "What should I do today?", "Explain dopamine", "How was my sleep?", or "Show my patterns".`,
    evidenceBadge: { level: "HIGH", source: "REVIVE Companion" },
    actionLabel: "Start 5-Minute Timer",
    actionType: "start-5m"
  };
}
