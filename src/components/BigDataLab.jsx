import React, { useState, useEffect, useRef } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, filteredCards.length, currentCardIndex, showResetModal]);

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
    <div className="min-h-screen pb-24 md:pb-16 px-3 sm:px-6 md:px-12 relative max-w-full overflow-x-hidden">
      
      {/* Sticky Header with Navigation */}
      <div 
        className={`sticky z-50 mx-auto w-full mb-6 sm:mb-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled 
          ? 'max-w-5xl top-2 sm:top-4 rounded-2xl sm:rounded-full px-4 sm:px-8 py-2.5 sm:py-3 bg-[#a855f7]/30 backdrop-blur-[100px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10' 
          : 'max-w-6xl top-0 rounded-b-2xl sm:rounded-b-[2.5rem] px-4 sm:px-10 py-3 sm:py-5 bg-[#a855f7]/5 backdrop-blur-[24px] border-b border-white/5'
        }`}
      >
        <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a href="/" className="text-text-muted hover:text-white transition-colors p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-lg hover:bg-white/5 flex-shrink-0" title="Volver a Mis Cursos">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </a>
            <div className="truncate">
              <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold text-text-main tracking-tight truncate">Base de Datos y Big Data</h1>
              <p className="text-xs sm:text-sm text-text-muted hidden sm:block truncate">SQL Server, T-SQL, Triggers, Cursores y Arquitectura BI</p>
            </div>
          </div>

          {/* Desktop Mode Switcher */}
          <div className="hidden sm:inline-flex items-center gap-1.5 p-1 rounded-full bg-surface border border-white/10 shadow-sm flex-shrink-0">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                activeTab === 'flashcards'
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="7" y1="14" x2="13" y2="14"/></svg>
              <span>Flashcards</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'flashcards' ? 'bg-white/20' : 'bg-surface'}`}>{FLASHCARDS.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                activeTab === 'quiz'
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg>
              <span>Quiz</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'quiz' ? 'bg-white/20' : 'bg-surface'}`}>{QUIZ_QUESTIONS.length}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full">

        {/* ========================================================================= */}
        {/* FLASHCARDS VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'flashcards' && (
          <div className="flex flex-col gap-6 animate-fade-in w-full">
            
            {/* Status & Category Filters */}
            <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-main font-bold">
                    Tarjeta {currentCardIndex + 1} de {filteredCards.length}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Dominadas: {masteredIds.length} / {FLASHCARDS.length}
                  </span>
                </div>
                <span className="text-text-muted text-xs sm:text-sm font-mono">
                  {categoryFilter} ({filteredCards.length})
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#9333ea] to-[#a855f7] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` }}
                />
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      categoryFilter === cat
                        ? 'bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-surface border-white/10 text-text-muted hover:text-white hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Flashcard Stage */}
            <div className="w-full flex justify-center [perspective:1600px]">
              <div
                onClick={() => setIsFlipped(prev => !prev)}
                className="relative w-full min-h-[380px] sm:min-h-[420px] rounded-3xl cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
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
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                      {currentCard?.term}
                    </h2>
                    <p className="text-text-muted text-base sm:text-lg max-w-lg">
                      {currentCard?.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-text-muted text-xs sm:text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                    <span>Haz clic o presiona Espacio para ver la explicación</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div 
                  className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 sm:p-10 border border-accent/30 shadow-2xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#181522] to-[#0f0c18]"
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

                  <div className="my-auto py-4 flex flex-col gap-4 overflow-y-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-accent">
                      {currentCard?.term}
                    </h3>
                    <p className="text-text-main text-sm sm:text-base md:text-lg leading-relaxed">
                      {currentCard?.definition}
                    </p>
                    {currentCard?.code && (
                      <div className="bg-black/60 rounded-xl p-4 border border-white/10 overflow-x-auto text-left">
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

            {/* Flashcard Controls */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Primary Row: Prev / Next */}
              <div className="flex items-center justify-center gap-4 w-full">
                <button
                  onClick={handlePrevCard}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-text-main bg-surface border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  <span>Anterior</span>
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Siguiente</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

              {/* Secondary Row: Random / Mastered */}
              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  onClick={handleRandomCard}
                  className="px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-text-muted hover:text-white bg-surface/50 border border-white/5 hover:border-white/10 transition-all flex items-center gap-2 active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                  <span>Aleatorio</span>
                </button>
                <button
                  onClick={toggleMastered}
                  className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 border ${
                    isCurrentMastered
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-surface/50 border-white/5 text-text-muted hover:text-white hover:border-white/10'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{isCurrentMastered ? 'Dominada' : 'Marcar como dominada'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* QUIZ VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-6 animate-fade-in w-full">

            {/* Quiz Top Status Bar */}
            <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-main font-bold text-sm">
                    Pregunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-[#c084fc] font-mono text-xs">
                    Aciertos: {correctCount}
                  </span>
                </div>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-white bg-surface border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  <span>Reiniciar</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAllQuizCompleted 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-[#9333ea] to-[#a855f7]'
                  }`}
                  style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {currentQuiz && (
              <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-accent/15 border border-accent/40 text-[#c084fc] font-mono text-xs font-bold">
                    {currentQuiz.topic}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface border border-white/10 font-mono text-xs text-text-muted">
                    #{quizIndex + 1}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                  {currentQuiz.stem}
                </h2>

                {currentQuiz.code && (
                  <div className="bg-black/60 rounded-2xl p-4 border border-white/10 overflow-x-auto text-left">
                    <pre className="font-mono text-xs sm:text-sm text-[#d8b4fe] whitespace-pre-wrap break-words">
                      <code>{currentQuiz.code}</code>
                    </pre>
                  </div>
                )}

                {/* Option Buttons */}
                <div className="flex flex-col gap-3">
                  {currentQuiz.options.map((optText, idx) => {
                    const letters = ['A', 'B', 'C'];
                    const chosen = quizAnswers[currentQuiz.id];
                    const isAnswered = typeof chosen === 'number';
                    const isThisCorrect = idx === currentQuiz.correct;
                    const isThisSelected = chosen === idx;

                    let btnStyles = "bg-surface border-white/10 text-text-main hover:border-accent/40 hover:bg-white/5";
                    let letterStyles = "bg-white/10 text-text-muted";

                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnStyles = "bg-emerald-500/15 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                        letterStyles = "bg-emerald-500 text-black font-extrabold";
                      } else if (isThisSelected) {
                        btnStyles = "bg-rose-500/15 border-rose-500/50 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]";
                        letterStyles = "bg-rose-500 text-white font-extrabold";
                      } else {
                        btnStyles = "bg-surface/40 border-white/5 text-text-muted opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 min-w-0 ${btnStyles}`}
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

                {/* Quiz Navigation */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    disabled={quizIndex === 0}
                    onClick={() => setQuizIndex(prev => prev - 1)}
                    className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-text-muted hover:text-white bg-surface border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Anterior
                  </button>

                  {!isLastQuizQuestion ? (
                    <button
                      disabled={!isCurrentAnswered}
                      onClick={() => setQuizIndex(prev => prev + 1)}
                      className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all flex items-center gap-2"
                    >
                      <span>Siguiente pregunta</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {/* Final Result Card (Visible only when completed) */}
            {isAllQuizCompleted && isLastQuizQuestion && (
              <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-accent/40 shadow-2xl text-center flex flex-col items-center gap-6 animate-fade-in">
                <span className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/50 text-[#c084fc] font-mono text-xs font-bold uppercase tracking-wider">
                  Resultado final del simulacro
                </span>

                <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-accent">
                  {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
                </div>

                <div className="max-w-md flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-white">
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
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-xs font-mono text-text-muted uppercase">Aciertos</span>
                    <span className="text-2xl font-extrabold text-emerald-400">{correctCount}</span>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-xs font-mono text-text-muted uppercase">Errores</span>
                    <span className="text-2xl font-extrabold text-rose-400">{QUIZ_QUESTIONS.length - correctCount}</span>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-xs font-mono text-text-muted uppercase">Total</span>
                    <span className="text-2xl font-extrabold text-text-main">{QUIZ_QUESTIONS.length}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={handleResetQuiz}
                    className="px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#9333ea] to-[#a855f7] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] transition-all active:scale-95"
                  >
                    Reiniciar cuestionario
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className="px-6 py-3.5 rounded-2xl font-bold text-text-main bg-surface border border-white/10 hover:border-white/20 transition-all active:scale-95"
                  >
                    Repasar en Flashcards
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer Note */}
        <footer className="pt-6 border-t border-white/5 text-center text-text-muted text-xs leading-relaxed">
          Contenido estructurado para preparación de examen oral: SQL Server, T-SQL (Triggers, Cursores, Window Functions), MongoDB NoSQL y Arquitectura ETL / BI (Kimball).
        </footer>

      </div>

      {/* Floating Mobile Dock */}
      <div className="sm:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="glass-panel rounded-full p-1.5 border border-white/15 shadow-2xl flex items-center gap-2 pointer-events-auto bg-black/80 backdrop-blur-2xl">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
              activeTab === 'flashcards'
                ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="7" y1="10" x2="17" y2="10"/></svg>
            <span>Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
              activeTab === 'quiz'
                ? 'bg-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/></svg>
            <span>Quiz</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Reset Quiz */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
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
