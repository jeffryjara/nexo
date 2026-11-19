import React, { useState, useEffect, useRef } from 'react';
import { FLASHCARDS, QUIZ_QUESTIONS } from '../data/bigDataQuestions';

export default function BigDataLab() {
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState([]);
  
  // Fluid UI/UX Animation & Boundary Limit States
  const [cardAnimClass, setCardAnimClass] = useState('');
  const [masteredAnim, setMasteredAnim] = useState(false);
  const [unansweredWarn, setUnansweredWarn] = useState(false);
  const [shuffleSpin, setShuffleSpin] = useState(false);
  const [boundaryHit, setBoundaryHit] = useState(null); // 'start' | 'end' | null
  
  // Transition locks to prevent animation collision
  const isCardTransitioningRef = useRef(false);
  const touchCardStart = useRef({ x: 0, y: 0, time: 0 });

  // Apple Rubber-Band Overscroll Physics
  const [overscrollY, setOverscrollY] = useState(0);
  const [isOverscrollReleasing, setIsOverscrollReleasing] = useState(false);
  const touchStartYRef = useRef(0);
  const isTouchingRef = useRef(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedMastered = localStorage.getItem('nexo_bd_mastered');
      if (savedMastered) setMasteredIds(JSON.parse(savedMastered));

      const savedAnswers = localStorage.getItem('nexo_bd_answers_v2');
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
      localStorage.setItem('nexo_bd_answers_v2', JSON.stringify(quizAnswers));
    } catch (e) {}
  }, [quizAnswers]);

  // Apple Rubber-Band Overscroll (Touch & Wheel Physics)
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartYRef.current = e.touches[0].clientY;
      isTouchingRef.current = true;
      setIsOverscrollReleasing(false);
    };

    const handleTouchMove = (e) => {
      if (!isTouchingRef.current || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartYRef.current;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const isAtTop = scrollY <= 1;
      const isAtBottom = scrollY + clientHeight >= scrollHeight - 4;

      if (isAtTop && deltaY > 0) {
        // Pulling down past top boundary (Apple Rubber-Band resistance)
        const pull = Math.min(80, Math.pow(deltaY, 0.7) * 2.2);
        setOverscrollY(pull);
      } else if (isAtBottom && deltaY < 0) {
        // Pulling up past bottom boundary (Apple Rubber-Band resistance)
        const pull = -Math.min(80, Math.pow(Math.abs(deltaY), 0.7) * 2.2);
        setOverscrollY(pull);
      } else if (overscrollY !== 0) {
        setOverscrollY(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isTouchingRef.current) return;
      isTouchingRef.current = false;
      if (overscrollY !== 0) {
        setIsOverscrollReleasing(true);
        setOverscrollY(0);
        setTimeout(() => setIsOverscrollReleasing(false), 450);
      }
    };

    // Wheel overscroll for trackpad / mouse
    let wheelTimeout = null;
    const handleWheel = (e) => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const isAtTop = scrollY <= 1;
      const isAtBottom = scrollY + clientHeight >= scrollHeight - 4;

      if (isAtTop && e.deltaY < -4) {
        setOverscrollY(20);
        setIsOverscrollReleasing(true);
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          setOverscrollY(0);
          setTimeout(() => setIsOverscrollReleasing(false), 450);
        }, 140);
      } else if (isAtBottom && e.deltaY > 4) {
        setOverscrollY(-20);
        setIsOverscrollReleasing(true);
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          setOverscrollY(0);
          setTimeout(() => setIsOverscrollReleasing(false), 450);
        }, 140);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [overscrollY]);

  // Flashcards (All 30 Cards)
  const currentCard = FLASHCARDS[currentCardIndex] || FLASHCARDS[0];
  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  // Next Card with Exit & Enter Animations
  const handleNextCard = () => {
    if (isCardTransitioningRef.current) return;
    setIsFlipped(false);
    
    if (currentCardIndex === FLASHCARDS.length - 1) {
      // Boundary limit reached!
      setCardAnimClass('animate-boundary-right');
      setBoundaryHit('end');
      setTimeout(() => {
        setCardAnimClass('');
        setBoundaryHit(null);
      }, 450);
      return;
    }

    isCardTransitioningRef.current = true;
    setCardAnimClass('animate-card-exit-left');

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
      setCardAnimClass('animate-card-enter-right');
      setTimeout(() => {
        setCardAnimClass('');
        isCardTransitioningRef.current = false;
      }, 280);
    }, 150);
  };

  // Prev Card with Exit & Enter Animations
  const handlePrevCard = () => {
    if (isCardTransitioningRef.current) return;
    setIsFlipped(false);
    
    if (currentCardIndex === 0) {
      // Boundary limit reached!
      setCardAnimClass('animate-boundary-left');
      setBoundaryHit('start');
      setTimeout(() => {
        setCardAnimClass('');
        setBoundaryHit(null);
      }, 450);
      return;
    }

    isCardTransitioningRef.current = true;
    setCardAnimClass('animate-card-exit-right');

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev - 1);
      setCardAnimClass('animate-card-enter-left');
      setTimeout(() => {
        setCardAnimClass('');
        isCardTransitioningRef.current = false;
      }, 280);
    }, 150);
  };

  // Random Card with Spring Pop
  const handleRandomCard = () => {
    if (isCardTransitioningRef.current || FLASHCARDS.length <= 1) return;
    let nextIdx = currentCardIndex;
    while (nextIdx === currentCardIndex) {
      nextIdx = Math.floor(Math.random() * FLASHCARDS.length);
    }
    isCardTransitioningRef.current = true;
    setIsFlipped(false);
    setShuffleSpin(true);
    setCardAnimClass('animate-card-exit-fade');

    setTimeout(() => {
      setCurrentCardIndex(nextIdx);
      setCardAnimClass('animate-card-enter-pop');
      setShuffleSpin(false);
      setTimeout(() => {
        setCardAnimClass('');
        isCardTransitioningRef.current = false;
      }, 280);
    }, 130);
  };

  const toggleMastered = () => {
    if (!currentCard) return;
    setMasteredAnim(true);
    setTimeout(() => setMasteredAnim(false), 450);
    setMasteredIds((prev) => 
      prev.includes(currentCard.id)
        ? prev.filter(id => id !== currentCard.id)
        : [...prev, currentCard.id]
    );
  };

  // Swipe Gestures for Mobile Flashcards
  const onCardTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchCardStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const onCardTouchEnd = (e) => {
    if (!touchCardStart.current.time) return;
    const deltaX = e.changedTouches[0].clientX - touchCardStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchCardStart.current.y;
    const deltaTime = Date.now() - touchCardStart.current.time;
    touchCardStart.current.time = 0;

    // Detect horizontal swipe (>45px, more horizontal than vertical, under 400ms)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && deltaTime < 400) {
      if (deltaX < 0) {
        handleNextCard();
      } else {
        handlePrevCard();
      }
    }
  };

  // Quiz Stats & Computed Values
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];
  const answeredCount = Object.keys(quizAnswers).length;
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (quizAnswers[q.id] === q.correct) correctCount += 1;
  });

  const isCurrentAnswered = typeof quizAnswers[currentQuiz?.id] === 'number';
  const isLastQuizQuestion = quizIndex === QUIZ_QUESTIONS.length - 1;
  const isAllQuizCompleted = answeredCount === QUIZ_QUESTIONS.length;
  const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  const handlePrevQuiz = () => {
    if (quizIndex === 0) return;
    setQuizIndex((prev) => prev - 1);
  };

  const handleNextQuiz = () => {
    if (!isCurrentAnswered) {
      // Tactile boundary limit: requires selecting an option first!
      setUnansweredWarn(true);
      setTimeout(() => setUnansweredWarn(false), 600);
      return;
    }
    if (!isLastQuizQuestion) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setShowResultsModal(true);
    }
  };

  const handleJumpToQuiz = (targetIdx) => {
    if (targetIdx === quizIndex) return;
    setQuizIndex(targetIdx);
  };

  const handleSelectQuizOption = (optIdx) => {
    if (isCurrentAnswered || !currentQuiz) return;
    setUnansweredWarn(false);
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: optIdx
    }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizIndex(0);
    setShowResetModal(false);
    setShowResultsModal(false);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResetModal || showResultsModal) {
        if (e.key === 'Escape') {
          setShowResetModal(false);
          setShowResultsModal(false);
        }
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
      } else if (activeTab === 'quiz') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextQuiz();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevQuiz();
        } else if (['1', '2', '3', '4'].includes(e.key) && !isCurrentAnswered) {
          e.preventDefault();
          handleSelectQuizOption(parseInt(e.key, 10) - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, FLASHCARDS.length, currentCardIndex, quizIndex, isCurrentAnswered, showResetModal, showResultsModal, currentCard]);

  return (
    <div className="min-h-screen relative max-w-full font-sans antialiased text-white selection:bg-[#af52de]/30 touch-smooth overflow-x-hidden">
      
      {/* 1. Apple-Inspired Frosted Glass Sticky Header (Optimized for Mobile GPU) */}
      <header className="sticky top-0 z-40 w-full bg-[#09090b]/94 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.35)] gpu-layer">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Top / Left: Back + Title + Dynamic Subtitle */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <a 
                href="/" 
                className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/[0.08] active:scale-95 flex-shrink-0 touch-smooth"
                title="Volver a Mis Cursos"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </a>
              <div className="min-w-0">
                <h1 className="text-[15px] sm:text-[18px] md:text-xl font-bold tracking-tight text-white truncate">
                  Base de Datos y Big Data
                </h1>
                
                {/* Dynamic Counter */}
                <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-tight truncate">
                  {activeTab === 'flashcards' ? (
                    <span className="text-[#c084fc]">
                      Tarjeta {currentCardIndex + 1} de {FLASHCARDS.length}
                    </span>
                  ) : (
                    <span className="text-[#c084fc]">
                      Pregunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Reiniciar: icon only */}
            {activeTab === 'quiz' && (
              <button
                onClick={() => setShowResetModal(true)}
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] active:scale-90 transition-all shadow-sm flex-shrink-0 touch-smooth"
                title="Reiniciar cuestionario"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            )}
          </div>

          {/* Right: Reiniciar Button (desktop icon only) + Apple Segmented Control */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {activeTab === 'quiz' && (
              <button
                onClick={() => setShowResetModal(true)}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-white/80 hover:text-white bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] active:scale-90 transition-all shadow-sm flex-shrink-0 touch-smooth"
                title="Reiniciar cuestionario"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            )}

            {/* Apple Segmented Control */}
            <div className="flex items-center p-1 rounded-full bg-[#1c1c1e]/90 border border-white/[0.08] shadow-inner w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm tracking-tight transition-all duration-200 touch-smooth ${
                  activeTab === 'flashcards'
                    ? 'bg-[#9333ea] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="7" y1="10" x2="17" y2="10"/></svg>
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm tracking-tight transition-all duration-200 touch-smooth ${
                  activeTab === 'quiz'
                    ? 'bg-[#9333ea] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/></svg>
                <span>Quiz</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Content Area with Apple Rubber-Band Overscroll Physics */}
      <main 
        className={`max-w-4xl mx-auto px-3 sm:px-6 w-full overflow-x-hidden ${
          activeTab === 'flashcards'
            ? 'h-[calc(100dvh-130px)] sm:h-[calc(100dvh-145px)] min-h-[460px] pt-2 pb-20 sm:pb-24 flex flex-col justify-center'
            : 'pt-5 sm:pt-8 pb-32 sm:pb-36 flex flex-col gap-6'
        }`}
        style={{
          transform: `translate3d(0, ${overscrollY}px, 0)`,
          transition: isOverscrollReleasing ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          willChange: overscrollY !== 0 || isOverscrollReleasing ? 'transform' : 'auto'
        }}
      >
        
        {/* ================= FLASHCARDS VIEW (FULL HEIGHT + SPRING MOTION & EXIT/ENTER) ================= */}
        {activeTab === 'flashcards' && (
          <div className="relative flex flex-col justify-center w-full h-full max-h-[760px] animate-fade-in overflow-hidden">
            
            {/* Boundary Limit Floating Indicator */}
            {boundaryHit && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-black/95 border border-white/20 text-[#d8b4fe] text-xs font-mono font-semibold shadow-2xl animate-spring-pop pointer-events-none gpu-layer">
                {boundaryHit === 'start' ? '← Primera tarjeta del curso' : 'Última tarjeta del curso →'}
              </div>
            )}

            {/* 3D Flashcard Stage with Touch Swipe */}
            <div className="w-full h-full flex justify-center [perspective:1600px]">
              <div
                onClick={() => setIsFlipped(prev => !prev)}
                onTouchStart={onCardTouchStart}
                onTouchEnd={onCardTouchEnd}
                className={`relative w-full h-full rounded-[28px] cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)] select-none ${cardAnimClass}`}
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d'
                }}
              >
                {/* FRONT FACE (Pure Solid Surface, Zero Heavy Blur Lag) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#141416] rounded-[28px] p-6 sm:p-10 border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.45)] flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8b4fe] font-mono text-xs font-semibold">
                      {currentCard?.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 ${
                      masteredAnim ? 'animate-spring-pop' : ''
                    } ${
                      isCurrentMastered 
                        ? 'bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158]' 
                        : 'bg-white/[0.05] border border-white/[0.08] text-white/50'
                    }`}>
                      {isCurrentMastered ? '✓ Dominada' : 'En repaso'}
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center flex flex-col items-center justify-center gap-3 sm:gap-4 px-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                      {currentCard?.term}
                    </h2>
                    <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed">
                      {currentCard?.subtitle || currentCard?.definition_short}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-white/40 text-xs sm:text-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span>Toca para voltear o desliza para navegar</span>
                  </div>
                </div>

                {/* BACK FACE (Pure Solid Surface, Zero Heavy Blur Lag) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#111113] rounded-[28px] p-6 sm:p-10 border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.45)] flex flex-col justify-between"
                  style={{
                    transform: 'rotateY(180deg)',
                    WebkitTransform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8b4fe] font-mono text-xs font-semibold">
                      {currentCard?.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 ${
                      masteredAnim ? 'animate-spring-pop' : ''
                    } ${
                      isCurrentMastered 
                        ? 'bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158]' 
                        : 'bg-white/[0.05] border border-white/[0.08] text-white/50'
                    }`}>
                      {isCurrentMastered ? '✓ Dominada' : 'En repaso'}
                    </span>
                  </div>

                  <div className="my-auto py-4 flex flex-col gap-3 text-left overflow-y-auto max-h-[calc(100%-90px)] pr-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {currentCard?.term}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                      {currentCard?.definition}
                    </p>
                    {currentCard?.code && (
                      <div className="bg-black/70 rounded-2xl p-4 border border-white/[0.08] overflow-x-auto text-left">
                        <pre className="font-mono text-xs sm:text-sm text-[#d8b4fe] whitespace-pre-wrap break-words">
                          <code>{currentCard.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-white/40 text-xs sm:text-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span>Toca de nuevo para volver al término</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Keyboard Hints */}
            <p className="hidden md:block text-center text-white/35 text-xs font-medium mt-3">
              Atajos: <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Espacio</kbd> Voltear &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&larr;</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&rarr;</kbd> Navegar &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">M</kbd> Dominar &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">R</kbd> Aleatoria
            </p>

          </div>
        )}

        {/* ================= QUIZ VIEW ================= */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-6 w-full">
            
            {/* Question Card */}
            {currentQuiz && (
              <div className="bg-[#141416] p-6 sm:p-9 rounded-[30px] border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex flex-col gap-6">
                
                {/* Category Pill */}
                <div className="flex items-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8b4fe] font-mono text-xs font-semibold">
                    {currentQuiz.topic || currentQuiz.category}
                  </span>
                </div>

                {/* Question Statement */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                  {currentQuiz.stem || currentQuiz.question}
                </h2>

                {/* Optional Question Code Snippet */}
                {currentQuiz.code && (
                  <div className="bg-black/70 rounded-2xl p-4 border border-white/[0.08] overflow-x-auto text-left">
                    <pre className="font-mono text-xs sm:text-sm text-[#d8b4fe] whitespace-pre-wrap break-words">
                      <code>{currentQuiz.code}</code>
                    </pre>
                  </div>
                )}

                {/* Unanswered Boundary Limit Warning Banner */}
                {unansweredWarn && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold animate-spring-pop">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Selecciona una opción para avanzar a la siguiente pregunta</span>
                  </div>
                )}

                {/* Multiple Choice Options */}
                <div className={`flex flex-col gap-3 transition-transform ${unansweredWarn ? 'animate-tactile-shake' : ''}`}>
                  {currentQuiz.options.map((optText, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isAnswered = isCurrentAnswered;
                    const selectedIdx = quizAnswers[currentQuiz.id];
                    const isSelected = selectedIdx === idx;
                    const isCorrect = idx === currentQuiz.correct;

                    let btnStyles = "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] hover:translate-x-1 text-white/90";
                    let letterStyles = "bg-white/[0.06] text-white/60 border border-white/[0.08]";
                    let bounceAnim = "";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyles = "bg-[#30D158]/15 border-[#30D158]/50 text-[#30D158] shadow-[0_0_24px_rgba(48,209,88,0.2)]";
                        letterStyles = "bg-[#30D158] text-black font-bold";
                        bounceAnim = isSelected ? "animate-success-pulse" : "animate-spring-pop";
                      } else if (isSelected) {
                        btnStyles = "bg-[#FF453A]/15 border-[#FF453A]/50 text-[#FF453A] shadow-[0_0_24px_rgba(255,69,58,0.2)]";
                        letterStyles = "bg-[#FF453A] text-white font-bold";
                        bounceAnim = "animate-tactile-shake";
                      } else {
                        btnStyles = "bg-white/[0.015] border-white/[0.03] text-white/35 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-[20px] border transition-all duration-200 flex items-start gap-4 min-w-0 active:scale-[0.985] touch-smooth ${btnStyles} ${bounceAnim}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs flex-shrink-0 transition-colors ${letterStyles}`}>
                          {letters[idx]}
                        </span>
                        <span className="text-[15px] sm:text-base leading-relaxed break-words font-normal">
                          {optText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {isCurrentAnswered && (
                  <div className={`p-5 rounded-[22px] border animate-spring-pop flex flex-col gap-2 ${
                    quizAnswers[currentQuiz.id] === currentQuiz.correct
                      ? 'bg-[#30D158]/10 border-[#30D158]/30'
                      : 'bg-[#FF453A]/10 border-[#FF453A]/30'
                  }`}>
                    <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                      {quizAnswers[currentQuiz.id] === currentQuiz.correct ? (
                        <span className="text-[#30D158] flex items-center gap-1.5 animate-spring-pop">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Correcto
                        </span>
                      ) : (
                        <span className="text-[#FF453A] flex items-center gap-1.5">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Respuesta incorrecta
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {currentQuiz.explanation}
                    </p>
                  </div>
                )}

                {/* Quick Jump Question Grid (Full Width Grid with Animated Transitions) */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white/40">Navegación de preguntas:</span>
                    <span className="text-xs font-mono text-white/50">{answeredCount}/{QUIZ_QUESTIONS.length} respondidas</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2 w-full">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const answered = typeof quizAnswers[q.id] === 'number';
                      const correct = quizAnswers[q.id] === q.correct;
                      const active = idx === quizIndex;

                      let chipStyle = "bg-white/[0.04] text-white/40 border-white/[0.05] hover:bg-white/[0.08] hover:text-white";
                      if (active) {
                        chipStyle = "bg-[#9333ea] text-white font-bold border-transparent shadow-sm scale-[1.04]";
                      } else if (answered) {
                        chipStyle = correct 
                          ? "bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30 font-semibold hover:bg-[#30D158]/30" 
                          : "bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30 font-semibold hover:bg-[#FF453A]/30";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => handleJumpToQuiz(idx)}
                          className={`w-full aspect-square sm:aspect-auto sm:h-10 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-mono border transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-90 touch-smooth ${chipStyle}`}
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

          </div>
        )}

      </main>

      {/* 3. Apple-Style Large Touch Target Bottom Dock (Optimized Mobile Layout) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#09090b]/94 backdrop-blur-md border-t border-white/[0.08] px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.45)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3 w-full">
          
          {/* FLASHCARDS: 4 Touch-Optimized Action Buttons */}
          {activeTab === 'flashcards' && (
            <>
              {/* 1. Anterior (Icon on mobile, icon+label on desktop) */}
              <button
                onClick={handlePrevCard}
                className="w-11 sm:w-auto h-12 sm:h-13 px-0 sm:px-5 rounded-2xl font-semibold text-xs sm:text-sm text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] active:scale-[0.92] transition-transform duration-200 touch-smooth flex items-center justify-center gap-2 flex-shrink-0"
                title={currentCardIndex === 0 ? "Primera tarjeta (límite)" : "Tarjeta anterior (←)"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 18-6-6 6-6"/></svg>
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* 2. Aleatorio (Icon on mobile, icon+label on desktop) */}
              <button
                onClick={handleRandomCard}
                className="w-11 sm:w-auto h-12 sm:h-13 px-0 sm:px-5 rounded-2xl font-semibold text-xs sm:text-sm text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] active:scale-[0.92] transition-transform duration-200 touch-smooth flex items-center justify-center gap-2 flex-shrink-0"
                title="Tarjeta aleatoria (R)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={`transition-transform duration-500 ${shuffleSpin ? 'rotate-180 scale-125' : ''}`}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                <span className="hidden sm:inline">Aleatorio</span>
              </button>

              {/* 3. Marcar como Dominada (Flexible Pill) */}
              <button
                onClick={toggleMastered}
                className={`flex-1 sm:flex-initial h-12 sm:h-13 px-3 sm:px-5 rounded-2xl font-semibold text-xs sm:text-sm active:scale-[0.92] transition-all duration-200 border touch-smooth flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 ${
                  masteredAnim ? 'animate-spring-pop' : ''
                } ${
                  isCurrentMastered
                    ? 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/40 shadow-[0_0_16px_rgba(48,209,88,0.2)]'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Marcar como dominada (M)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="truncate">{isCurrentMastered ? 'Dominada' : 'Dominar'}</span>
              </button>

              {/* 4. Siguiente (SOLID PURPLE, Primary Button) */}
              <button
                onClick={handleNextCard}
                className="flex-[1.2] sm:flex-initial h-12 sm:h-13 px-4 sm:px-7 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-[0.92] transition-all duration-200 touch-smooth flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title={currentCardIndex === FLASHCARDS.length - 1 ? "Última tarjeta (límite)" : "Siguiente tarjeta (→)"}
              >
                <span className="truncate">Siguiente</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </>
          )}

          {/* QUIZ: 2 Prominent Apple Buttons (SOLID COLOR, BALANCED PROPORTIONS + LIMIT FEEDBACK) */}
          {activeTab === 'quiz' && (
            <div className="w-full flex items-center gap-3">
              {/* 1. Anterior */}
              <button
                onClick={handlePrevQuiz}
                className="flex-1 sm:flex-initial sm:min-w-[140px] h-12 sm:h-13 px-4 sm:px-6 rounded-2xl font-semibold text-xs sm:text-sm text-white/80 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] disabled:opacity-30 active:scale-[0.92] transition-all duration-200 flex items-center justify-center gap-2 touch-smooth"
                title={quizIndex === 0 ? "Primera pregunta (límite)" : "Pregunta anterior"}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 18-6-6 6-6"/></svg>
                <span>Anterior</span>
              </button>

              {/* 2. Siguiente pregunta / Ver resultados */}
              {!isLastQuizQuestion ? (
                <button
                  onClick={handleNextQuiz}
                  className={`flex-[1.4] sm:flex-1 h-12 sm:h-13 px-5 sm:px-8 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm transition-all duration-200 flex items-center justify-center gap-2 touch-smooth ${
                    !isCurrentAnswered ? 'opacity-60 hover:opacity-80 active:scale-[0.96]' : 'active:scale-[0.92]'
                  } ${unansweredWarn ? 'animate-rubber-band' : ''}`}
                  title={!isCurrentAnswered ? "Debes responder para continuar" : "Siguiente pregunta"}
                >
                  <span>Siguiente pregunta</span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className={`flex-[1.4] sm:flex-1 h-12 sm:h-13 px-5 sm:px-8 rounded-2xl font-bold text-xs sm:text-sm text-black bg-[#30D158] hover:bg-[#34C759] shadow-sm transition-all duration-200 flex items-center justify-center gap-2 touch-smooth ${
                    !isCurrentAnswered ? 'opacity-60 hover:opacity-80 active:scale-[0.96]' : 'active:scale-[0.92]'
                  } ${unansweredWarn ? 'animate-rubber-band' : ''}`}
                  title={!isCurrentAnswered ? "Debes responder para ver resultados" : "Ver resultados"}
                >
                  <span>Ver resultados</span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. Apple Sheet Confirmation Modal to Reset Quiz with Spring Bounce */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 animate-fade-in" onClick={() => setShowResetModal(false)}></div>
          <div className="bg-[#161618] relative rounded-[28px] p-6 sm:p-8 max-w-sm w-full shadow-[0_24px_50px_rgba(0,0,0,0.7)] border border-white/[0.1] text-center flex flex-col gap-5 z-10 animate-modal-bounce gpu-layer">
            <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto text-white/80 animate-spring-pop">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-white">¿Reiniciar cuestionario?</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Se limpiarán tus respuestas registradas y tu puntaje volverá a cero para un nuevo intento.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <button
                onClick={handleResetQuiz}
                className="w-full h-12 rounded-2xl font-semibold text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-[0.96] transition-all touch-smooth"
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full h-12 rounded-2xl font-semibold text-sm text-white/80 hover:text-white bg-white/[0.06] border border-white/[0.08] active:scale-[0.96] transition-all touch-smooth"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Apple High-End Results Summary Modal with Spring Bounce */}
      {showResultsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/85 animate-fade-in" 
            onClick={() => setShowResultsModal(false)}
          ></div>
          
          <div className="bg-[#161618] relative rounded-[32px] p-6 sm:p-9 max-w-md w-full shadow-[0_28px_60px_rgba(0,0,0,0.75)] border border-white/[0.1] text-center flex flex-col items-center gap-6 z-10 animate-modal-bounce gpu-layer">
            
            {/* Close Button */}
            <button
              onClick={() => setShowResultsModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-2.5 rounded-full hover:bg-white/[0.06] active:scale-95 transition touch-smooth"
              title="Cerrar modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Apple Activity / Fitness Style Circular Gauge */}
            <div className="relative flex items-center justify-center mt-1">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                />
                {/* Active Progress Ring (SOLID COLOR) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (1 - percentage / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tight text-white flex items-baseline">
                  {percentage}<span className="text-base font-semibold text-white/50 ml-0.5">%</span>
                </span>
                <span className="text-[10px] font-mono uppercase text-[#d8b4fe] font-semibold tracking-wider">
                  Precisión
                </span>
              </div>
            </div>

            {/* Diagnosis / Title & Message */}
            <div className="space-y-2 text-center">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {percentage >= 85 
                  ? "¡Excelente preparación oral!"
                  : percentage >= 65 
                    ? "Buen nivel general"
                    : "Recomendado reforzar conceptos clave"}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                {percentage >= 85 
                  ? "Dominas con solidez el diccionario técnico de SQL Server, triggers y arquitectura ETL / BI."
                  : percentage >= 65 
                    ? "Tienes una base firme; repasa en Flashcards los temas fallados para responder con total seguridad en la sustentación."
                    : "Dedica una ronda completa a las Flashcards y vuelve a intentar el cuestionario para consolidar la sintaxis T-SQL."}
              </p>
            </div>

            {/* Detailed Apple-Style Inset Grouped Tiles */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {/* Acertados */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-[20px] p-3.5 flex flex-col items-center justify-center">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Aciertos
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#30D158] mt-1">
                  {correctCount}
                </span>
              </div>

              {/* Errores */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-[20px] p-3.5 flex flex-col items-center justify-center">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Errores
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FF453A] mt-1">
                  {QUIZ_QUESTIONS.length - correctCount}
                </span>
              </div>

              {/* Total */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-[20px] p-3.5 flex flex-col items-center justify-center">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Total
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                  {QUIZ_QUESTIONS.length}
                </span>
              </div>
            </div>

            {/* Large Apple Action Buttons in Modal */}
            <div className="flex flex-col gap-3 w-full mt-1">
              <button
                onClick={() => {
                  setShowResultsModal(false);
                  setShowResetModal(true);
                }}
                className="w-full h-13 sm:h-14 rounded-2xl font-semibold text-[15px] sm:text-base text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-smooth"
              >
                Reiniciar cuestionario
              </button>
              <button
                onClick={() => {
                  setShowResultsModal(false);
                  setActiveTab('flashcards');
                }}
                className="w-full h-13 sm:h-14 rounded-2xl font-semibold text-[15px] sm:text-base text-white/90 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-smooth"
              >
                Repasar en Flashcards
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
