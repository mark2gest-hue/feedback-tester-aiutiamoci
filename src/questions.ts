export interface Question {
  id: string;
  phase: 'base' | 'pro' | 'cyber';
  phaseTitle: string;
  category: string;
  title: string;
  description?: string;
  type: 'rating_5' | 'rating_10' | 'single_choice' | 'text';
  options?: { value: string | number; label: string; score?: number }[];
}

export const TEST_QUESTIONS: Question[] = [
  // ================= FASE 1: BASE (AI START) =================
  {
    id: 'base_clarity',
    phase: 'base',
    phaseTitle: 'Modulo 1: AI Start (Fondamenta)',
    category: 'Chiarezza Didattica',
    title: 'Comprensione Iniziale dei Concetti',
    description: 'I concetti base dei modelli LLM spiegati da Stefano sono risultati lineari e accessibili anche a chi parte da zero?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Molto confusi', score: 20 },
      { value: 2, label: 'Poco chiari', score: 40 },
      { value: 3, label: 'Comprensibili', score: 60 },
      { value: 4, label: 'Molto chiari', score: 80 },
      { value: 5, label: 'Cristallini', score: 100 },
    ],
  },
  {
    id: 'base_prompts',
    phase: 'base',
    phaseTitle: 'Modulo 1: AI Start (Fondamenta)',
    category: 'Pratica Immediata',
    title: 'Esercitazioni e Struttura dei Primi Prompt',
    description: 'La spiegazione su come formulare un prompt efficace (ruolo, contesto, task, vincoli) è stata facile da replicare in autonomia?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Impossibile da replicare', score: 20 },
      { value: 2, label: 'Difficile', score: 40 },
      { value: 3, label: 'Abbastanza facile', score: 60 },
      { value: 4, label: 'Facile e intuitiva', score: 80 },
      { value: 5, label: 'Immediata al primo tentativo', score: 100 },
    ],
  },
  {
    id: 'base_pacing',
    phase: 'base',
    phaseTitle: 'Modulo 1: AI Start (Fondamenta)',
    category: 'Formato Video',
    title: 'Ritmo e Durata delle Lezioni Base',
    description: 'Come hai trovato la lunghezza e la velocità di esposizione dei singoli video introduttivi?',
    type: 'single_choice',
    options: [
      { value: 'slow', label: 'Troppo lenti o prolissi', score: 40 },
      { value: 'perfect', label: 'Perfettamente bilanciati', score: 100 },
      { value: 'fast', label: 'Troppo veloci / passaggi saltati', score: 60 },
    ],
  },
  {
    id: 'base_nps',
    phase: 'base',
    phaseTitle: 'Modulo 1: AI Start (Fondamenta)',
    category: 'Valutazione Modulo',
    title: 'Raccomanderesti il Modulo Base?',
    description: 'Con che probabilità consiglieresti questo modulo a un collega o conoscente a digiuno di AI?',
    type: 'rating_10',
  },

  // ================= FASE 2: PRO (WORKFLOW OPERATIVI) =================
  {
    id: 'pro_applicability',
    phase: 'pro',
    phaseTitle: 'Modulo 2: AI Pro (Workflow & Operatività)',
    category: 'Impatto Lavorativo',
    title: 'Applicabilità nel Lavoro Reale Quotidiano',
    description: 'I casi d’uso e le tecniche avanzate mostrate sono direttamente spendibili nella tua attività professionale da domani?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Per nulla spendibili', score: 20 },
      { value: 2, label: 'Poco utili', score: 40 },
      { value: 3, label: 'Abbastanza utili', score: 60 },
      { value: 4, label: 'Molto spendibili', score: 80 },
      { value: 5, label: 'Trasformativi per il mio lavoro', score: 100 },
    ],
  },
  {
    id: 'pro_screencast',
    phase: 'pro',
    phaseTitle: 'Modulo 2: AI Pro (Workflow & Operatività)',
    category: 'Qualità Video',
    title: 'Dimostrazioni a Schermo (Claude / ChatGPT)',
    description: 'Le schermate operative, i prompt digitati e i risultati a video erano nitidi, leggibili e facili da seguire?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Difficili da leggere/seguire', score: 20 },
      { value: 2, label: 'Poco visibili', score: 40 },
      { value: 3, label: 'Accettabili', score: 60 },
      { value: 4, label: 'Ben visibili e chiare', score: 80 },
      { value: 5, label: 'Perfette nei minimi dettagli', score: 100 },
    ],
  },
  {
    id: 'pro_difficulty',
    phase: 'pro',
    phaseTitle: 'Modulo 2: AI Pro (Workflow & Operatività)',
    category: 'Livello Sfida',
    title: 'Livello di Complessità del Modulo Pro',
    description: 'Rispetto al tuo livello di partenza, come hai percepito la difficoltà dei concetti?',
    type: 'single_choice',
    options: [
      { value: 'too_easy', label: 'Troppo facile / già noto', score: 50 },
      { value: 'balanced', label: 'Ideale, stimolante e pratico', score: 100 },
      { value: 'too_hard', label: 'Troppo tecnico / difficile', score: 60 },
    ],
  },
  {
    id: 'pro_tests',
    phase: 'pro',
    phaseTitle: 'Modulo 2: AI Pro (Workflow & Operatività)',
    category: 'Verifica Competenze',
    title: 'Utilità dei Test di Valutazione Intermedi',
    description: 'I quiz intermedi sulla piattaforma ti hanno aiutato a fissare le competenze apprese?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Inutili / fuori contesto', score: 20 },
      { value: 2, label: 'Poco utili', score: 40 },
      { value: 3, label: 'Sufficienti', score: 60 },
      { value: 4, label: 'Molto utili', score: 80 },
      { value: 5, label: 'Fondamentali per capire', score: 100 },
    ],
  },

  // ================= FASE 3: CYBERSECURITY & AI DEFENSE =================
  {
    id: 'cyber_urgency',
    phase: 'cyber',
    phaseTitle: 'Modulo 3: Cybersecurity & AI Defense',
    category: 'Consapevolezza Rischi',
    title: 'Percezione del Rischio e Sicurezza Aziendale',
    description: 'Quanto ritieni critica e urgente la protezione dei dati e la sicurezza delle applicazioni AI nella tua azienda?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Nessun interesse', score: 20 },
      { value: 2, label: 'Priorità bassa', score: 40 },
      { value: 3, label: 'Importante', score: 60 },
      { value: 4, label: 'Molto critica', score: 80 },
      { value: 5, label: 'Assoluta priorità strategica', score: 100 },
    ],
  },
  {
    id: 'cyber_clarity',
    phase: 'cyber',
    phaseTitle: 'Modulo 3: Cybersecurity & AI Defense',
    category: 'Esempi Pratici',
    title: 'Chiarezza delle Minacce Spiegate',
    description: 'I concetti di Prompt Injection, fuga di credenziali e rischi del Vibe Coding sono stati resi chiari con esempi reali?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Troppo astratti', score: 20 },
      { value: 2, label: 'Poco chiari', score: 40 },
      { value: 3, label: 'Chiari', score: 60 },
      { value: 4, label: 'Molto efficaci e concreti', score: 80 },
      { value: 5, label: 'Illuminanti', score: 100 },
    ],
  },
  {
    id: 'cyber_autonomy',
    phase: 'cyber',
    phaseTitle: 'Modulo 3: Cybersecurity & AI Defense',
    category: 'Autonomia Operativa',
    title: 'Consapevolezza e Guardrail Operativi',
    description: 'Dopo questa track, ti senti in grado di evitare errori critici (es. incollare dati sensibili o API key)?',
    type: 'rating_5',
    options: [
      { value: 1, label: 'Ancora totalmente insicuro', score: 20 },
      { value: 2, label: 'Poco sicuro', score: 40 },
      { value: 3, label: 'Abbastanza attento', score: 60 },
      { value: 4, label: 'Molto consapevole', score: 80 },
      { value: 5, label: 'Pienamente autonomo e vigile', score: 100 },
    ],
  },
  {
    id: 'cyber_future_interest',
    phase: 'cyber',
    phaseTitle: 'Modulo 3: Cybersecurity & AI Defense',
    category: 'Evoluzione',
    title: 'Direzione Preferita per Nuove Lezioni di Sicurezza',
    description: 'Se dovessimo registrare ulteriori approfondimenti, quale taglio preferiresti?',
    type: 'single_choice',
    options: [
      { value: 'practical_dev', label: 'Esempi di codice difensivo (SAST, RLS, Webhook)', score: 100 },
      { value: 'pmi_management', label: 'Policy aziendali e comportamento dipendenti', score: 100 },
      { value: 'tools_audit', label: 'Tool pratici per scansionare vulnerabilità e log', score: 100 },
    ],
  },

  // ================= VERDETTO FINALE APERTO =================
  {
    id: 'feedback_best_part',
    phase: 'pro',
    phaseTitle: 'Riflessioni & Verdetto Finale',
    category: 'Feedback Libero',
    title: 'La Cosa Più Utile che ti Porti a Casa',
    description: 'Qual è il singolo spunto, prompt o lezione che ha fatto la differenza per te?',
    type: 'text',
  },
  {
    id: 'feedback_improvements',
    phase: 'pro',
    phaseTitle: 'Riflessioni & Verdetto Finale',
    category: 'Feedback Libero',
    title: 'Cosa Manca o Cosa Andrebbe Migliorato?',
    description: 'Sii totalmente onesto e trasparente: cosa ti ha lasciato insoddisfatto o cosa vorresti approfondito?',
    type: 'text',
  },
];
