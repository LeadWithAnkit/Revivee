// Internal Scientific Rationale & Evidence Registry for REVIVE Features
// Requirement 27: Structured documentation of feature rationale, evidence sources, limitations, and implementation.

export interface FeatureScientificSpec {
  featureId: string;
  featureName: string;
  category: "Focus & Attention" | "Stress & Nervous System" | "Sleep Architecture" | "Data & Behavioral Patterning";
  rationale: string;
  evidenceSource: string;
  limitations: string;
  implementationDetails: string;
}

export const scientificRationaleRegistry: FeatureScientificSpec[] = [
  {
    featureId: "40hz-binaural",
    featureName: "40Hz Gamma Binaural Beats",
    category: "Focus & Attention",
    rationale: "Binaural beat stimulation at 40Hz (gamma band) promotes neural phase-locking in auditory cortex and prefrontal attention networks, supporting working memory capacity.",
    evidenceSource: "Colzato et al. (2017), Frontiers in Human Neuroscience; WHO & Peer-reviewed Auditory Entrainment Studies.",
    limitations: "Individual response varies; efficacy is non-diagnostic and depends on headphone stereo separation.",
    implementationDetails: "Web Audio API generates 200Hz left sine and 240Hz right sine wave with real-time gain ramp and stereo channel merger."
  },
  {
    featureId: "60s-box-breathing",
    featureName: "Box Breathing Protocol (4-4-4-4)",
    category: "Stress & Nervous System",
    rationale: "Controlled slow breathing with equal duration inhalation, hold, exhalation, and hold increases vagal tone and HRV, stimulating parasympathetic downregulation.",
    evidenceSource: "American Psychological Association (APA); Huberman Lab (Stanford Neurobiology); WHO Self-Help Guidelines.",
    limitations: "Provides acute temporary physiological calming; not a replacement for medical therapy during severe hyperventilation or respiratory conditions.",
    implementationDetails: "Canvas / SVG animated breath circle with Web Audio frequency pitch shift and step-based phase chime triggers."
  },
  {
    featureId: "54321-grounding",
    featureName: "5-4-3-2-1 Sensory Grounding",
    category: "Stress & Nervous System",
    rationale: "Engaging external sensory modalities (sight, touch, sound, smell, taste) interrupts intrusive rumination by shifting neural processing from Default Mode Network (DMN) to Task-Positive Network (TPN).",
    evidenceSource: "Substance Abuse and Mental Health Services Administration (SAMHSA); Cognitive Behavioral Therapy (CBT) protocols.",
    limitations: "Relies on active user participation and present-moment environmental awareness.",
    implementationDetails: "Interactive step-by-step checklist in ResetPanel guiding five sensory observations."
  },
  {
    featureId: "pomodoro-micro-blocks",
    featureName: "Pomodoro & 5-Minute Micro-Blocks",
    category: "Focus & Attention",
    rationale: "Lowering initial task friction to 5 or 25 minutes bypasses limbic threat response associated with task overwhelm, reducing procrastination via task-shrinking.",
    evidenceSource: "Cirillo (1986); Steel (2007) Procrastination Equation; Behavioral Science Principles.",
    limitations: "Requires self-enforced micro-breaks to avoid cumulative mental fatigue.",
    implementationDetails: "State-managed countdown timer in Focus.tsx with interval alerts, pause/resume, and distraction logging."
  },
  {
    featureId: "non-causal-matrix",
    featureName: "Non-Causal Pattern Matrix & Mind Map",
    category: "Data & Behavioral Patterning",
    rationale: "Viewing co-occurring observations (e.g., low sleep co-occurring with high study stress) encourages observational self-awareness while explicitly avoiding correlation-causation fallacies.",
    evidenceSource: "Causal Inference Guidelines (Pearl, 2009); Evidence-based Behavioral Self-Monitoring.",
    limitations: "Patterns demonstrate correlation in user's self-logged dataset, not epidemiological or medical causality.",
    implementationDetails: "IndexedDB dataset query feeding 2D dynamic vector graph (MindMap.tsx) and scatter plots (Insights.tsx)."
  }
];
