import React, { useState, useEffect } from 'react';
import { FLASHCARDS, QUIZ_QUESTIONS } from '../data/bigDataQuestions';

export default function BigDataLab() {
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState([]);
  
  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedMastered = localStorage.getItem('nexo_bd_mastered');
      if (savedMastered) setMasteredIds(JSON.parse(savedMastered));

      const savedAnswers = localStorage.getItem('nexo_bd_answers');
      if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers));
    } catch (e) {
      // LocalStorage access fail silent
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexo_bd_mastered', JSON.stringify(masteredIds));
    } catch (e) {}
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('nexo_bd_answers', JSON.stringify(quizAnswers));
    } catch (e) {}
  }, [quizAnswers]);

  // Categories
  const categories = ['Todas', 'Integridad y Tipos', 'T-SQL y Ventana', 'Triggers y Cursores', 'Big Data y BI'];

  // Filtered flashcards
  const filteredCards = categoryFilter === 'Todas' 
    ? FLASHCARDS 
    : FLASHCARDS.filter(c => c.category === categoryFilter);

  // Flashcard Actions
  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];
  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRandomCard = () => {
    if (filteredCards.length <= 1) return;
    let nextIdx = currentCardIndex;
    while (nextIdx === currentCardIndex) {
      nextIdx = Math.floor(Math.random() * filteredCards.length);
    }
    setIsFlipped(false);
    setCurrentCardIndex(nextIdx);
  };

  const toggleMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => 
      prev.includes(currentCard.id)
        ? prev.filter(id => id !== currentCard.id)
        : [...prev, currentCard.id]
    );
  };

  const selectCategory = (cat) => {
    setCategoryFilter(cat);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResetModal) {
        if (e.key === 'Escape') setShowResetModal(false);
        return;
      }
      if (activeTab === 'flashcards') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextCard();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevCard();
        } else if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.key.toLowerCase() === 'm' && document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          toggleMastered();
        } else if (e.key.toLowerCase() === 'r' && document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          handleRandomCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, filteredCards.length, currentCardIndex, showResetModal, currentCard]);

  // Quiz Stats
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];
  const answeredCount = Object.keys(quizAnswers).length;
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (quizAnswers[q.id] === q.correct) correctCount += 1;
  });

  const isCurrentAnswered = typeof quizAnswers[currentQuiz?.id] === 'number';
  const isLastQuizQuestion = quizIndex === QUIZ_QUESTIONS.length - 1;
  const isAllQuizCompleted = answeredCount === QUIZ_QUESTIONS.length;

  const handleSelectQuizOption = (optIdx) => {
    if (isCurrentAnswered || !currentQuiz) return;
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: optIdx
    }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizIndex(0);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen relative max-w-full">
      
      {/* 1. Sticky Header with Back Button, Title, Dynamic Counter & Tabs */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0a0c]/90 backdrop-blur-2xl border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Left: Back + Title + Dynamic Counter */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <a 
                href="/" 
                className="text-text-muted hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/5 flex-shrink-0"
                title="Volver a Mis Cursos"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </a>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-text-main tracking-tight truncate">
                  Base de Datos y Big Data
                </h1>
                
                {/* Dynamic Counter placed in the header */}
                <div className="flex items-center gap-2 text-xs font-mono font-medium truncate">
                  {activeTab === 'flashcards' ? (
                    <span className="text-[#c084fc]">
                      Tarjeta {currentCardIndex + 1} de {filteredCards.length}
                    </span>
                  ) : (
                    <span className="text-[#c084fc]">
                      Pregunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reiniciar Button + Switcher Tabs (Flashcards | Quiz) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {activeTab === 'quiz' && (
              <button
                onClick={() => setShowResetModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm text-text-muted hover:text-white bg-surface border border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-95 transition-all shadow-sm flex-shrink-0"
                title="Reiniciar cuestionario"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                <span>Reiniciar</span>
              </button>
            )}

            <div className="flex items-center p-1 rounded-full bg-surface/80 border border-white/10 shadow-inner w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === 'flashcards'
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="7" y1="10" x2="17" y2="10"/></svg>
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === 'quiz'
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/></svg>
                <span>Quiz</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-28 sm:pb-32 flex flex-col gap-5 sm:gap-6 w-full">
        
        {/* ================= FLASHCARDS VIEW ================= */}
        {activeTab === 'flashcards' && (
          <div className="flex flex-col gap-4 sm:gap-6 w-full animate-fade-in">
            
            {/* Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-surface border-white/10 text-text-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 3D Flashcard Stage */}
            <div className="w-full flex justify-center [perspective:1600px]">
              <div
                onClick={() => setIsFlipped(prev => !prev)}
                className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-3xl cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* FRONT FACE */}
                <div 
                  className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between [backface-visibility:hidden] bg-gradient-to-br from-[#16161c] to-[#0e0e12]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-[#c084fc] font-mono text-xs font-semibold">
                      {currentCard?.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                      isCurrentMastered 
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-surface border border-white/10 text-text-muted'
                    }`}>
                      {isCurrentMastered ? '✓ Dominada' : 'En repaso'}
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center flex flex-col items-center justify-center gap-3">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                      {currentCard?.term}
                    </h2>
                    <p className="text-text-muted text-sm sm:text-base max-w-lg">
                      {currentCard?.subtitle || currentCard?.definition_short}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-text-muted text-xs sm:text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span>Haz clic o presiona Espacio para ver la respuesta</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div 
                  className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#131318] to-[#0a0a0c]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/50 text-[#c084fc] font-mono text-xs font-semibold">
                      {currentCard?.category}
                    </span>
                    <span className="text-xs font-mono text-accent">
                      {isCurrentMastered ? '✓ Dominada' : 'En repaso'}
                    </span>
                  </div>

                  <div className="my-auto py-4 flex flex-col gap-3 text-left max-h-[280px] sm:max-h-[300px] overflow-y-auto pr-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {currentCard?.term}
                    </h3>
                    <p className="text-text-main text-sm sm:text-base leading-relaxed">
                      {currentCard?.definition}
                    </p>
                    {currentCard?.code && (
                      <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 overflow-x-auto text-left">
                        <pre className="font-mono text-xs sm:text-sm text-[#d8b4fe] whitespace-pre-wrap break-words">
                          <code>{currentCard.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-text-muted text-xs sm:text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span>Haz clic de nuevo para volver al término</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Keyboard Hints */}
            <p className="hidden md:block text-center text-text-muted/60 text-xs">
              Atajos de teclado: <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Espacio</kbd> Voltear &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&larr;</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&rarr;</kbd> Navegar &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">M</kbd> Dominar &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">R</kbd> Aleatoria
            </p>

          </div>
        )}

        {/* ================= QUIZ VIEW ================= */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            
            {/* Question Card */}
            {currentQuiz && (
              <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5 sm:gap-6 bg-gradient-to-br from-[#141418] to-[#0c0c0e]">
                
                {/* Category & Tag */}
                <div className="flex items-center justify-between gap-3">
                  <span className="px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-[#c084fc] font-mono text-xs font-semibold">
                    {currentQuiz.topic || currentQuiz.category}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    #{quizIndex + 1}
                  </span>
                </div>

                {/* Question Statement */}
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {currentQuiz.stem || currentQuiz.question}
                </h2>

                {/* Optional Question Code Snippet */}
                {currentQuiz.code && (
                  <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 overflow-x-auto text-left">
                    <pre className="font-mono text-xs sm:text-sm text-[#d8b4fe] whitespace-pre-wrap break-words">
                      <code>{currentQuiz.code}</code>
                    </pre>
                  </div>
                )}

                {/* Multiple Choice Options */}
                <div className="flex flex-col gap-3">
                  {currentQuiz.options.map((optText, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isAnswered = isCurrentAnswered;
                    const selectedIdx = quizAnswers[currentQuiz.id];
                    const isSelected = selectedIdx === idx;
                    const isCorrect = idx === currentQuiz.correct;

                    let btnStyles = "bg-surface/60 border-white/10 hover:border-white/20 hover:bg-surface text-text-main";
                    let letterStyles = "bg-white/5 text-text-muted border border-white/10";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyles = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
                        letterStyles = "bg-emerald-500 text-black font-bold";
                      } else if (isSelected) {
                        btnStyles = "bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]";
                        letterStyles = "bg-rose-500 text-white font-bold";
                      } else {
                        btnStyles = "bg-surface/30 border-white/5 text-text-muted opacity-50";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 sm:gap-4 min-w-0 ${btnStyles}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs flex-shrink-0 transition-colors ${letterStyles}`}>
                          {letters[idx]}
                        </span>
                        <span className="text-sm sm:text-base leading-relaxed break-words">
                          {optText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {isCurrentAnswered && (
                  <div className={`p-4 sm:p-5 rounded-2xl border animate-fade-in flex flex-col gap-1.5 ${
                    quizAnswers[currentQuiz.id] === currentQuiz.correct
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}>
                    <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                      {quizAnswers[currentQuiz.id] === currentQuiz.correct ? (
                        <span className="text-emerald-400">✓ Correcto</span>
                      ) : (
                        <span className="text-rose-400">✕ Respuesta incorrecta</span>
                      )}
                    </div>
                    <p className="text-text-main text-xs sm:text-sm leading-relaxed">
                      {currentQuiz.explanation}
                    </p>
                  </div>
                )}

                {/* Quick Jump Question Grid */}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <span className="text-xs font-mono text-text-muted">Saltar a pregunta:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const answered = typeof quizAnswers[q.id] === 'number';
                      const correct = quizAnswers[q.id] === q.correct;
                      const active = idx === quizIndex;

                      let chipStyle = "bg-surface/60 text-text-muted border-white/5";
                      if (active) {
                        chipStyle = "bg-accent text-white font-bold border-accent shadow-[0_0_10px_rgba(168,85,247,0.4)]";
                      } else if (answered) {
                        chipStyle = correct 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                          : "bg-rose-500/20 text-rose-400 border-rose-500/30";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setQuizIndex(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono border transition-all flex items-center justify-center hover:scale-105 ${chipStyle}`}
                          title={`Pregunta ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Final Results Summary Card (Shown when all answered or finished) */}
            {isAllQuizCompleted && (
              <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-accent/40 shadow-2xl flex flex-col items-center text-center gap-6 bg-gradient-to-b from-[#181024] to-[#0e0e12] animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent text-3xl font-extrabold shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
                </div>

                <div className="space-y-2 max-w-lg">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {correctCount >= 27 
                      ? "¡Excelente preparación para el examen oral!"
                      : correctCount >= 20 
                        ? "Buen nivel general"
                        : "Recomendado reforzar conceptos clave"}
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                    {correctCount >= 27 
                      ? "Dominas con solidez el diccionario técnico de SQL Server, las tablas lógicas de triggers y los fundamentos de ETL y NoSQL."
                      : correctCount >= 20 
                        ? "Tienes una base firme; repasa en Flashcards los conceptos que fallaste para responder sin dudas en la sustentación oral."
                        : "Dedica una ronda completa a las Flashcards por categoría y vuelve a intentar el cuestionario para consolidar la sintaxis T-SQL."}
                  </p>
                </div>

                {/* Score Tiles */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
                  <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-text-muted uppercase">Aciertos</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">{correctCount}</span>
                  </div>
                  <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-text-muted uppercase">Errores</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-rose-400">{QUIZ_QUESTIONS.length - correctCount}</span>
                  </div>
                  <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-text-muted uppercase">Total</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-text-main">{QUIZ_QUESTIONS.length}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all active:scale-95"
                  >
                    Reiniciar cuestionario
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className="px-5 py-3 rounded-xl font-bold text-sm text-text-main bg-surface border border-white/10 hover:border-white/20 transition-all active:scale-95"
                  >
                    Repasar en Flashcards
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 3. Fixed Bottom Bar with Actions replacing the floating switcher pill */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-2xl border-t border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          
          {/* FLASHCARDS: 4 Fixed Buttons */}
          {activeTab === 'flashcards' && (
            <>
              {/* 1. Anterior */}
              <button
                onClick={handlePrevCard}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-text-main bg-surface border border-white/10 hover:border-white/20 active:scale-95 transition"
                title="Tarjeta anterior (←)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span className="hidden xs:inline">Anterior</span>
              </button>

              {/* 2. Aleatorio */}
              <button
                onClick={handleRandomCard}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-text-muted hover:text-white bg-surface/60 border border-white/10 hover:border-white/20 active:scale-95 transition"
                title="Tarjeta aleatoria (R)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                <span className="hidden sm:inline">Aleatorio</span>
              </button>

              {/* 3. Marcar como Dominada */}
              <button
                onClick={toggleMastered}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm active:scale-95 transition border ${
                  isCurrentMastered
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-surface/60 border-white/10 text-text-muted hover:text-white hover:border-white/20'
                }`}
                title="Marcar como dominada (M)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{isCurrentMastered ? 'Dominada' : 'Dominar'}</span>
              </button>

              {/* 4. Siguiente */}
              <button
                onClick={handleNextCard}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] active:scale-95 transition"
                title="Siguiente tarjeta (→)"
              >
                <span>Siguiente</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </>
          )}

          {/* QUIZ: 2 Fixed Buttons */}
          {activeTab === 'quiz' && (
            <>
              {/* 1. Anterior */}
              <button
                disabled={quizIndex === 0}
                onClick={() => setQuizIndex(prev => prev - 1)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-text-muted hover:text-white bg-surface border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Anterior</span>
              </button>

              {/* 2. Siguiente pregunta */}
              {!isLastQuizQuestion ? (
                <button
                  disabled={!isCurrentAnswered}
                  onClick={() => setQuizIndex(prev => prev + 1)}
                  className="flex-[2] sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.35)] active:scale-95 transition"
                >
                  <span>Siguiente pregunta</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ) : (
                <button
                  disabled={!isCurrentAnswered}
                  onClick={() => {
                    // Si ya respondió la última pregunta, scroll al resumen o toggle
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="flex-[2] sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95 transition"
                >
                  <span>Ver resultados</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              )}
            </>
          )}

        </div>
      </div>

      {/* 4. Confirmation Modal to Reset Quiz */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
          <div className="glass-panel relative rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out] border border-white/10 text-center flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">¿Reiniciar el cuestionario?</h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Se borrarán todas tus respuestas registradas y tu puntaje volverá a cero para comenzar un nuevo intento.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-5 py-3 rounded-xl font-bold text-text-main bg-surface border border-white/10 hover:bg-white/5 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetQuiz}
                className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-accent hover:bg-accent/90 border border-accent transition shadow-lg"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
