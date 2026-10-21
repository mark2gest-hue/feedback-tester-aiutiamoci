import React, { useState, useEffect } from 'react';
import { TEST_QUESTIONS } from './questions.ts';
import { RadarChart } from './RadarChart.tsx';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Send,
  RotateCcw,
  Download,
  Users
} from 'lucide-react';

export default function App() {
  const [testerName, setTesterName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);

  // Carica i dati storici salvati localmente per la dashboard admin
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aiutiamoci_tester_feedbacks');
      if (saved) {
        setAllSubmissions(JSON.parse(saved));
      }
    } catch {
      // Ignora errori localStorage
    }
  }, [isFinished]);

  const currentQ = TEST_QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / TEST_QUESTIONS.length) * 100);

  // Calcolo Punteggi per le 3 Fasi
  const computeScores = () => {
    const calcPhaseScore = (phase: 'base' | 'pro' | 'cyber') => {
      const phaseQuestions = TEST_QUESTIONS.filter(
        (q) => q.phase === phase && q.type !== 'text'
      );
      if (phaseQuestions.length === 0) return 85;

      let totalScore = 0;
      let count = 0;

      phaseQuestions.forEach((q) => {
        const ans = answers[q.id];
        if (ans !== undefined) {
          if (q.type === 'rating_5') {
            totalScore += (Number(ans) / 5) * 100;
            count++;
          } else if (q.type === 'rating_10') {
            totalScore += (Number(ans) / 10) * 100;
            count++;
          } else if (q.type === 'single_choice' && q.options) {
            const opt = q.options.find((o) => o.value === ans);
            if (opt && opt.score !== undefined) {
              totalScore += opt.score;
              count++;
            }
          }
        }
      });

      return count > 0 ? Math.round(totalScore / count) : 80;
    };

    const baseScore = calcPhaseScore('base');
    const proScore = calcPhaseScore('pro');
    const cyberScore = calcPhaseScore('cyber');
    const overallScore = Math.round((baseScore + proScore + cyberScore) / 3);

    return { baseScore, proScore, cyberScore, overallScore };
  };

  const handleSelectAnswer = (val: string | number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < TEST_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Fine test
      const scores = computeScores();
      const submission = {
        id: `submission_${Date.now()}`,
        date: new Date().toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        testerName: testerName.trim() || 'Beta Tester Anonimo',
        scores,
        answers,
      };

      try {
        const prevData = JSON.parse(
          localStorage.getItem('aiutiamoci_tester_feedbacks') || '[]'
        );
        const updated = [submission, ...prevData];
        localStorage.setItem('aiutiamoci_tester_feedbacks', JSON.stringify(updated));
        setAllSubmissions(updated);
      } catch (e) {
        console.error(e);
      }

      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const scores = computeScores();

  // Esporta CSV per Stefano e Marco
  const exportCSV = () => {
    if (allSubmissions.length === 0) return;
    const headers = ['Data', 'Nome Tester', 'Base Score', 'Pro Score', 'Cyber Score', 'Totale', 'Cosa Piaciuto', 'Miglioramenti'];
    const rows = allSubmissions.map((s) => [
      `"${s.date}"`,
      `"${s.testerName}"`,
      s.scores.baseScore,
      s.scores.proScore,
      s.scores.cyberScore,
      s.scores.overallScore,
      `"${(s.answers.feedback_best_part || '').replace(/"/g, '""')}"`,
      `"${(s.answers.feedback_improvements || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_tester_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-20 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Aiutiamoci — Beta Testing</span>
            <h1 className="text-sm font-semibold text-neutral-200">Valutazione Percorso Corsi AI</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          <span>{showAdmin ? 'Torna al Test' : 'Dashboard Risultati'}</span>
          {allSubmissions.length > 0 && (
            <span className="ml-1 bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {allSubmissions.length}
            </span>
          )}
        </button>
      </header>

      {/* DASHBOARD ADMIN */}
      {showAdmin ? (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Risultati Tester Raccolti
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Riepilogo delle valutazioni sui 3 moduli (Base, Pro, Cybersecurity).
              </p>
            </div>
            {allSubmissions.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Esporta CSV
              </button>
            )}
          </div>

          {allSubmissions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">Nessuna recensione ancora registrata.</p>
              <p className="text-xs text-neutral-600 mt-1">Le risposte dei tester appariranno qui automaticamente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allSubmissions.map((sub, idx) => (
                <div key={idx} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-800/60">
                    <div>
                      <span className="font-semibold text-neutral-200">{sub.testerName}</span>
                      <span className="text-xs text-neutral-500 ml-3">{sub.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Base: <strong className="text-blue-400">{sub.scores.baseScore}%</strong></span>
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Pro: <strong className="text-blue-400">{sub.scores.proScore}%</strong></span>
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Cyber: <strong className="text-blue-400">{sub.scores.cyberScore}%</strong></span>
                      <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">Totale: {sub.scores.overallScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/40">
                      <div className="font-semibold text-emerald-400 mb-1">Cosa ha funzionato meglio:</div>
                      <p className="text-neutral-300 italic">{sub.answers.feedback_best_part || 'Nessun commento'}</p>
                    </div>
                    <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/40">
                      <div className="font-semibold text-amber-400 mb-1">Cosa andrebbe migliorato:</div>
                      <p className="text-neutral-300 italic">{sub.answers.feedback_improvements || 'Nessun commento'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : !isStarted ? (
        /* SCHERMATA INTRODUTTIVA */
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl text-center backdrop-blur-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-100">
              Il tuo Feedback è Prezioso
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Hai partecipato come uno dei 10 beta tester selezionati per i nostri percorsi formativi sull'AI applicata.
              Aiutaci a perfezionare i 3 moduli con una valutazione onesta e trasparente.
            </p>

            <div className="my-6 grid grid-cols-3 gap-2 text-center">
              <div className="bg-neutral-950/80 border border-neutral-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Fase 1</span>
                <span className="text-xs font-semibold text-neutral-200">AI Start</span>
              </div>
              <div className="bg-neutral-950/80 border border-neutral-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Fase 2</span>
                <span className="text-xs font-semibold text-neutral-200">AI Pro</span>
              </div>
              <div className="bg-neutral-950/80 border border-neutral-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Fase 3</span>
                <span className="text-xs font-semibold text-neutral-200">Cyber Defense</span>
              </div>
            </div>

            <div className="mb-6 text-left">
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Il tuo Nome o Azienda (Opzionale)
              </label>
              <input
                type="text"
                placeholder="Es. Mario Rossi / Studio Beta"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              onClick={() => setIsStarted(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <span>Inizia il Questionario (4 min)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      ) : isFinished ? (
        /* SCHERMATA FINALE CON GRAFICO RADAR */
        <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-center">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 md:p-8 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Grazie per il tuo Contributo!</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Ecco la sintesi visiva del tuo indice di gradimento per le 3 macro-aree del percorso.
            </p>

            {/* RADAR CHART */}
            <div className="my-6">
              <RadarChart
                baseScore={scores.baseScore}
                proScore={scores.proScore}
                cyberScore={scores.cyberScore}
                overallScore={scores.overallScore}
              />
            </div>

            {/* SCORE CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">AI Start</span>
                <span className="text-lg font-bold text-neutral-200">{scores.baseScore}%</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">AI Pro</span>
                <span className="text-lg font-bold text-neutral-200">{scores.proScore}%</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">Cyber Defense</span>
                <span className="text-lg font-bold text-neutral-200">{scores.cyberScore}%</span>
              </div>
              <div className="bg-blue-950/40 border border-blue-600/30 p-3 rounded-xl">
                <span className="text-[10px] text-blue-400 uppercase block font-semibold">Indice Globale</span>
                <span className="text-lg font-bold text-blue-400">{scores.overallScore}%</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mb-6 max-w-md mx-auto">
              I tuoi suggerimenti sono stati salvati e aiuteranno Marco e Stefano a rifinire i dettagli prima del rilascio ufficiale.
            </p>

            <button
              onClick={() => {
                setIsFinished(false);
                setIsStarted(false);
                setCurrentIdx(0);
                setAnswers({});
              }}
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-200 px-4 py-2 border border-neutral-800 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Compila una nuova recensione
            </button>
          </div>
        </main>
      ) : (
        /* CARD DOMANDA CORRENTE */
        <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col justify-center">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-neutral-400 mb-1.5">
              <span className="font-semibold text-blue-400">{currentQ.phaseTitle}</span>
              <span className="text-neutral-500 font-mono">
                {currentIdx + 1} / {TEST_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
                  {currentQ.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-100 leading-snug">
                {currentQ.title}
              </h3>
              {currentQ.description && (
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {currentQ.description}
                </p>
              )}

              {/* OPZIONI DI RISPOSTA */}
              <div className="mt-6">
                {/* 1. SCALA 1-5 */}
                {currentQ.type === 'rating_5' && (
                  <div className="space-y-2">
                    {currentQ.options?.map((opt) => {
                      const isSelected = answers[currentQ.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectAnswer(opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-xs md:text-sm font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                              : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/30'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-neutral-500 font-mono text-xs">{opt.value} / 5</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. SCALA 1-10 (NPS) */}
                {currentQ.type === 'rating_10' && (
                  <div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-2">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                        const isSelected = answers[currentQ.id] === num;
                        return (
                          <button
                            key={num}
                            onClick={() => handleSelectAnswer(num)}
                            className={`py-3 rounded-lg border font-mono text-sm font-semibold transition ${
                              isSelected
                                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>Poco probabile</span>
                      <span>Assolutamente sì</span>
                    </div>
                  </div>
                )}

                {/* 3. SCELTA SINGOLA */}
                {currentQ.type === 'single_choice' && (
                  <div className="space-y-2">
                    {currentQ.options?.map((opt) => {
                      const isSelected = answers[currentQ.id] === opt.value;
                      return (
                        <button
                          key={String(opt.value)}
                          onClick={() => handleSelectAnswer(opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-xs md:text-sm font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                              : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/30'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. CAMPO TESTO APERTO */}
                {currentQ.type === 'text' && (
                  <div>
                    <textarea
                      rows={4}
                      value={String(answers[currentQ.id] || '')}
                      onChange={(e) => handleSelectAnswer(e.target.value)}
                      placeholder="Scrivi liberamente la tua opinione (opzionale)..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs md:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tasti Avanti / Indietro */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-800/70">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="text-xs text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Precedente</span>
              </button>

              <button
                onClick={handleNext}
                disabled={
                  currentQ.type !== 'text' && answers[currentQ.id] === undefined
                }
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>
                  {currentIdx === TEST_QUESTIONS.length - 1 ? 'Completa e Invia' : 'Continua'}
                </span>
                {currentIdx === TEST_QUESTIONS.length - 1 ? (
                  <Send className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-3 text-center text-[11px] text-neutral-600">
        Piattaforma di Feedback & Testing Riservato © Aiutiamoci • Mark 2.0
      </footer>
    </div>
  );
}
