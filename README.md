# REVIVE
### Understand. Reset. Move.

REVIVE is a calm, personal cognition + recovery + CAT study-support web app.

---

## REVIVE Companion Architecture (`src/ai/`)

The application features a sophisticated, local-first **REVIVE Companion** pipeline that operates without external API keys or server dependencies:

```
USER MESSAGE
    ↓
safetyEngine.ts (Crisis & physical emergency detection)
    ↓
intentDetector.ts (Multi-intent classification: UNDERSTAND, RESET, FOCUS, STUDY, HEALTH, NUTRITION, SLEEP, MIND, MOTIVATION, DOPAMINE, DISTRACTION, CAT)
    ↓
topicExtractor.ts (Topic & signal token extraction)
    ↓
personalContext.ts (Filtered retrieval of IndexedDB observations, sessions & past intervention feedback)
    ↓
patternEngine.ts (Threshold-based non-causal pattern detection)
    ↓
knowledgeRetriever.ts (Weighted tag & keyword ranking across 9 structured knowledge domains)
    ↓
interventionSelector.ts (Selects 1 primary & 1 backup structured intervention, factoring past user feedback)
    ↓
responseBuilder.ts (Synthesizes calm, evidence-aware, non-diagnostic responses with source tags)
    ↓
Interactive UI (Action buttons, navigation & "Did that help?" outcome recorder)
```

---

## Structured Knowledge System (`src/data/knowledge/`)

Every knowledge card is structured with evidence levels and source tracking:

```ts
export interface KnowledgeItem {
  id: string;
  domain: DomainType;
  topic: string;
  subtopic: string;
  claim: string;
  explanation: string;
  evidenceLevel: "HIGH" | "MODERATE" | "LIMITED" | "PRELIMINARY" | "UNKNOWN";
  evidenceType: EvidenceType;
  relevantSignals: string[];
  relatedTopics: string[];
  usefulActions: string[];
  caution?: string;
  sourceIds: string[];
  lastReviewed: string;
}
```

### Knowledge Domains Covered
1. **Sleep**: Duration, consistency, circadian rhythm, caffeine timing, screens.
2. **Nutrition & Hydration**: Balanced diet, protein, fibre, thirst-guided intake, post-meal somnolence, limitations of self-diagnosis (no supplement pushing).
3. **Physical Health**: Multi-factorial fatigue, sedentary breaks, non-diagnostic symptom tracking.
4. **Mental Health & Stress**: Autonomic arousal, affect labeling, self-care, social connection.
5. **Attention & Focus**: Task switching, attention residue, environment friction, monotasking.
6. **Dopamine & Reward Science**: Reward prediction error, incentive salience, habit loops. Explicitly debunks internet myths like "dopamine detox", "depleted dopamine", and "damaged brain".
7. **Habits & Procrastination**: Cue-routine-reward, emotional regulation framing, micro-task shrinking, implementation intentions.
8. **Study Science**: Active recall, retrieval practice, spacing/distributed practice, interleaving, metacognition.
9. **CAT Preparation**: Energy-matched Quant, VARC, and DILR session sizing (Low = 5-10m, Normal = 20-45m, High = deep practice/mock).

---

## Official Sources Registry (`src/data/sources/sources.ts`)
* **WHO**: World Health Organization Guidelines
* **CDC**: Centers for Disease Control and Prevention
* **NIH / NIMH / NIDA / ODS**: National Institutes of Health, National Institute of Mental Health, National Institute on Drug Abuse, Office of Dietary Supplements
* **NICE / NHS**: UK National Institute for Health and Care Excellence, NHS England
* **PubMed / Cochrane**: Systematic reviews & peer-reviewed meta-analyses

---

## Safety & Non-Diagnostic Framing
* **Safety System**: Intercepts acute physical symptoms (chest pain, breathing difficulty) and severe distress/crisis, providing immediate helpline and emergency service escalation guidance.
* **Non-Diagnostic**: Never uses diagnostic terms ("You have ADHD", "You have depression", "Your dopamine is depleted"). Uses observational language ("Your entries show...", "Possible contributors include...").
* **Non-Causal Patterns**: Requires configurable thresholds (<7 entries: "Not enough data", 7-13: "Early pattern", 14-29: "Emerging pattern", 30+: "More stable personal pattern"). Never claims single causality.

---

## Future LLM / External Search Integration

To connect an LLM provider later safely:
1. Keep the browser frontend 100% free of secret API keys.
2. Implement a secure serverless function proxy (`React → Server Proxy → LLM Provider`).
3. Pass retrieved `knowledgeItems`, `personalContext`, and `safetyFlags` to the LLM as context rather than dumping the whole database.

---

## Run Locally

```bash
npm install
npm run dev
```

Build & Validate:

```bash
npm run build
```
