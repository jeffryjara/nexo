import React, { useState, useEffect, useRef } from 'react';
import { GlowCard } from './ui/spotlight-card';
import { InteractiveHoverButton } from './ui/InteractiveHoverButton';
import { todosLosProblemas } from '../data/problems';
import { evaluarBooleano, countVariables } from '../utils/engine';

export default function NexoLab() {

            

            

                const [scrolled, setScrolled] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [clearTarget, setClearTarget] = useState(null);
    const [kmapValues, setKmapValues] = useState({});

    // Apple Rubber-Band Overscroll Physics
    const [overscrollY, setOverscrollY] = useState(0);
    const [isOverscrollReleasing, setIsOverscrollReleasing] = useState(false);
    const touchStartYRef = useRef(0);
    const isTouchingRef = useRef(false);

    // Problem Animation & Boundary Feedback
    const [problemAnimClass, setProblemAnimClass] = useState('');
    const isProblemTransitioningRef = useRef(false);
    const [boundaryHit, setBoundaryHit] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apple Rubber-Band Overscroll Handlers
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
                const pull = Math.min(80, Math.pow(deltaY, 0.7) * 2.2);
                setOverscrollY(pull);
            } else if (isAtBottom && deltaY < 0) {
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

    const [currentIndex, setCurrentIndex] = useState(0);
            const currentProblem = todosLosProblemas[currentIndex];
            
            
            const [currentStep, setCurrentStep] = useState(1);
            const [tableErrors, setTableErrors] = useState([]);
            const [procErrors, setProcErrors] = useState([]);
            const [finalErrors, setFinalErrors] = useState([]);
const [userGrid, setUserGrid] = useState([]);
            const [userSteps, setUserSteps] = useState("");
            const [procedureMethod, setProcedureMethod] = useState('boole');
            const [kMapGrid, setKMapGrid] = useState(() => {
                const inputs = todosLosProblemas[0].inputs;
                let rows = 0; let cols = 0;
                if (inputs.length === 4) { rows = 4; cols = 4; }
                else if (inputs.length === 3) { rows = 2; cols = 4; }
                else if (inputs.length === 2) { rows = 2; cols = 2; }
                return Array.from({ length: rows }, () => Array(cols).fill('-'));
            });
            
            const getKMapDimensions = (numInputs) => {
                const inputs = currentProblem ? currentProblem.inputs : [];
                if (numInputs === 4) return { rows: ['00', '01', '11', '10'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2]+inputs[3], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 3) return { rows: ['0', '1'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 2) return { rows: ['0', '1'], cols: ['0', '1'], rowLabels: inputs[1], colLabels: inputs[0] };
                return null;
            };
            const [userFinal, setUserFinal] = useState("");
            
            const [status, setStatus] = useState("idle"); 
            const [errorMessages, setErrorMessages] = useState([]);
            const [showSolution, setShowSolution] = useState(false);
            
            const [hintsUsed, setHintsUsed] = useState(0);

            const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
            const [activeInput, setActiveInput] = useState(null); 
            const stepsRef = useRef(null);
            const stepsUnderlayRef = useRef(null);
            const finalRef = useRef(null);
            const [kbPos, setKbPos] = useState({ x: 0, y: 0 });
            const [isDragging, setIsDragging] = useState(false);
            const dragOffset = useRef({ x: 0, y: 0 });

            const getBinaryRow = (index, numInputs) => {
                let bin = index.toString(2);
                while (bin.length < numInputs) bin = "0" + bin;
                return bin.split("").map(Number);
            };

            useEffect(() => {
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const initialGrid = Array.from({ length: numRows }, () => Array(numInputs + 1).fill("-"));
                
                
                setCurrentStep(1);
                setTableErrors([]);
                setProcErrors([]);
                setFinalErrors([]);
setUserGrid(initialGrid);
                setUserSteps("");
                setUserFinal("");
                setStatus("idle");
                setErrorMessages([]);
                setShowSolution(false);
                setIsKeyboardOpen(false);
                setHintsUsed(0); 

                setKbPos({
                    x: window.innerWidth > 600 ? window.innerWidth / 2 - 250 : 10,
                    y: window.innerHeight - 350
                });
            }, [currentIndex, currentProblem]);

            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                if (cell === '-') {
                    return "w-12 h-12 sm:w-16 sm:h-14 text-xl sm:text-2xl rounded-xl font-bold transition-all border border-transparent !outline-none !shadow-none bg-transparent text-white/20 hover:bg-white/5";
                }
                const baseStyle = "w-12 h-12 sm:w-16 sm:h-14 text-xl sm:text-2xl rounded-xl font-bold transition-all shadow-sm border outline-none ";
                
                const numInputs = currentProblem.inputs.length;
                let correctValue;
                if (!isOutputCell) {
                    correctValue = (rIndex >> (numInputs - 1 - cIndex)) & 1;
                } else {
                    correctValue = currentProblem.correctTable[rIndex];
                }
                
                return baseStyle + "bg-transparent text-white border-white/20 hover:border-white/40";
            };

            const toggleCell = (rIndex, cIndex) => {
                const newGrid = [...userGrid];
                newGrid[rIndex] = [...newGrid[rIndex]];
                const currentVal = newGrid[rIndex][cIndex];
                if (currentVal === '-') newGrid[rIndex][cIndex] = 0;
                else if (currentVal === 0) newGrid[rIndex][cIndex] = 1;
                else newGrid[rIndex][cIndex] = 0;
                setUserGrid(newGrid);
                setStatus("idle"); 
            };

            const useHint = () => {
                if (hintsUsed < 3) {
                    setHintsUsed(hintsUsed + 1);
                }
            };

            
            
            const checkAnswer = () => {
                let errors = [];
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const correctT = currentProblem.correctTable;
                
                let tableOutputsCorrect = true;
                let foundCombinations = new Set();
                
                for (let i = 0; i < userGrid.length; i++) {
                    const row = userGrid[i];
                    const inputVals = row.slice(0, numInputs);
                    const outputVal = row[numInputs];
                    
                    if (row.includes('-')) {
                        errors.push("Tabla: Completa todos los valores ('0' o '1').");
                        tableOutputsCorrect = false;
                        continue;
                    }
                    const decimalValue = parseInt(inputVals.join(''), 2);
                    foundCombinations.add(decimalValue);
                    if (outputVal !== correctT[decimalValue]) tableOutputsCorrect = false;
                }

                if (foundCombinations.size !== numRows) {
                    errors.push("Tabla: Faltan combinaciones o hay repetidas.");
                } else if (!tableOutputsCorrect) {
                    errors.push("Tabla: Algunas salidas no son correctas.");
                }

                let procErrors = [];
                if (procedureMethod === 'karnaugh') {
                    const dims = getKMapDimensions(numInputs);
                    if (!dims) {
                        procErrors.push("Procedimiento: Karnaugh no soportado para este número de variables.");
                    } else {
                        let kmapIncomplete = false;
                        let kmapErrors = false;
                        for (let r = 0; r < dims.rows.length; r++) {
                            for (let c = 0; c < dims.cols.length; c++) {
                                if (kMapGrid[r][c] === '-') {
                                    kmapIncomplete = true;
                                } else {
                                    const decimalValue = parseInt(dims.cols[c] + dims.rows[r], 2);
                                    if (kMapGrid[r][c] !== correctT[decimalValue]) {
                                        kmapErrors = true;
                                    }
                                }
                            }
                        }
                        if (kmapIncomplete) {
                            procErrors.push("Procedimiento (Karnaugh): Completa todas las celdas del mapa ('0' o '1').");
                        } else if (kmapErrors) {
                            procErrors.push("Procedimiento (Karnaugh): Algunas celdas son incorrectas. Revisa tu tabla de verdad.");
                        }
                    }
                    if (procErrors.length > 0) errors.push(procErrors[0]);
                } else {
                    let mathLinesCount = 0;
                    const lines = userSteps.split('\n').map(l => l.trim()).filter(l => l !== '');
                    let initialVars = -1;
                    let strictMode = false;
                    let previousVars = -1;

                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];
                        if (line.includes('=')) {
                            mathLinesCount++;
                            let lineHasMathError = false;
                            for (let r = 0; r < numRows; r++) {
                                const values = getBinaryRow(r, numInputs);
                                const expected = correctT[r];
                                const evalResult = evaluarBooleano(line, currentProblem.inputs, values);
                                if (evalResult.error) {
                                    procErrors.push(`Procedimiento (Línea ${i+1}): ${evalResult.error}.`);
                                    lineHasMathError = true;
                                    break;
                                }
                                if (evalResult.result !== expected) {
                                    procErrors.push(`Procedimiento (Línea ${i+1}): Es lógicamente incorrecta.`);
                                    lineHasMathError = true;
                                    break;
                                }
                            }
                            if (lineHasMathError) break;

                            let currentVars = countVariables(line, currentProblem.inputs);
                            if (initialVars === -1) {
                                initialVars = currentVars;
                                previousVars = currentVars;
                            } else {
                                if (strictMode && currentVars > previousVars) {
                                    procErrors.push(`Procedimiento (Línea ${i+1}): Orden ilógico (añadiendo variables).`);
                                    break;
                                }
                                if (currentVars < initialVars) strictMode = true; 
                                previousVars = currentVars;
                            }
                        }
                    }

                    if (mathLinesCount < currentProblem.minLines) {
                        errors.push(`Procedimiento: Debes mostrar mínimo ${currentProblem.minLines} línea(s) de desarrollo.`);
                    } else if (procErrors.length > 0) {
                        errors.push(procErrors[0]);
                    }
                }

                if (userFinal.trim() === '') {
                    errors.push("Función final: El recuadro del resultado está vacío.");
                } else {
                    let finalError = false;
                    for (let r = 0; r < numRows; r++) {
                        const values = getBinaryRow(r, numInputs);
                        const expected = correctT[r];
                        const evalResult = evaluarBooleano(userFinal, currentProblem.inputs, values);
                        if (evalResult.error) {
                            errors.push(`Función final: ${evalResult.error}.`);
                            finalError = true;
                            break;
                        }
                        if (evalResult.result !== expected) {
                            errors.push("Función final: Tu resultado no equivale a la función lógica correcta.");
                            finalError = true;
                            break;
                        }
                    }
                    if (!finalError) {
                        const normalizedFinal = userFinal.replace(/\s+/g, '').toLowerCase();
                        if (!currentProblem.acceptableFinals.includes(normalizedFinal) && !currentProblem.acceptableFinals.some(a => a.includes(normalizedFinal))) {
                            errors.push("Función final: La expresión es correcta pero no parece estar simplificada al máximo.");
                        }
                    }
                }

                if (errors.length === 0) {
                    setStatus("correct");
                    setIsKeyboardOpen(false); 
                } else {
                    setStatus("error");
                    setErrorMessages(errors);
                }
            };


            const nextProblem = () => {
                if (isProblemTransitioningRef.current) return;
                if (currentIndex === todosLosProblemas.length - 1) {
                    setProblemAnimClass('animate-boundary-right');
                    setBoundaryHit('end');
                    setTimeout(() => {
                        setProblemAnimClass('');
                        setBoundaryHit(null);
                    }, 450);
                    return;
                }
                isProblemTransitioningRef.current = true;
                setProblemAnimClass('animate-card-exit-left');
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                    setProblemAnimClass('animate-card-enter-right');
                    setTimeout(() => {
                        setProblemAnimClass('');
                        isProblemTransitioningRef.current = false;
                    }, 280);
                }, 150);
            };

            const prevProblem = () => {
                if (isProblemTransitioningRef.current) return;
                if (currentIndex === 0) {
                    setProblemAnimClass('animate-boundary-left');
                    setBoundaryHit('start');
                    setTimeout(() => {
                        setProblemAnimClass('');
                        setBoundaryHit(null);
                    }, 450);
                    return;
                }
                isProblemTransitioningRef.current = true;
                setProblemAnimClass('animate-card-exit-right');
                setTimeout(() => {
                    setCurrentIndex(prev => prev - 1);
                    setProblemAnimClass('animate-card-enter-left');
                    setTimeout(() => {
                        setProblemAnimClass('');
                        isProblemTransitioningRef.current = false;
                    }, 280);
                }, 150);
            };

            const handleKeyboardClick = (char) => {
                const targetRef = activeInput === 'steps' ? stepsRef : finalRef;
                const targetSetter = activeInput === 'steps' ? setUserSteps : setUserFinal;
                
                if (targetRef.current) {
                    const el = targetRef.current;
                    const start = el.selectionStart;
                    const end = el.selectionEnd;
                    const val = el.value;
                    let newVal = val;
                    let cursorOffset = char.length;

                    if (char === 'Backspace') {
                        if (start > 0 && start === end) {
                            newVal = val.slice(0, start - 1) + val.slice(end);
                            cursorOffset = -1;
                        } else if (start !== end) {
                            newVal = val.slice(0, start) + val.slice(end);
                            cursorOffset = 0;
                        }
                    } else if (char === 'Enter') {
                        newVal = val.slice(0, start) + '\n' + val.slice(end);
                        cursorOffset = 1;
                    } else {
                        newVal = val.slice(0, start) + char + val.slice(end);
                    }

                    targetSetter(newVal);
                    
                    setTimeout(() => {
                        el.focus();
                        const newPos = Math.max(0, start + cursorOffset);
                        el.setSelectionRange(newPos, newPos);
                    }, 0);
                }
            };

            const onPointerDown = (e) => {
                setIsDragging(true);
                dragOffset.current = { x: e.clientX - kbPos.x, y: e.clientY - kbPos.y };
                e.target.setPointerCapture(e.pointerId);
            };
            const onPointerMove = (e) => {
                if (!isDragging) return;
                setKbPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
            };
            const onPointerUp = (e) => {
                setIsDragging(false);
                e.target.releasePointerCapture(e.pointerId);
            };

            const inputs = currentProblem.inputs;
            const output = currentProblem.output;

        const handleClearTables = () => setClearTarget('tables');
        const handleClearKMap = () => setClearTarget('kmap');
        const handleClearProcedimiento = () => setClearTarget('procedimiento');
        const handleClearFinal = () => setClearTarget('final');

        const executeClear = () => {
            if (clearTarget === 'tables') {
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const initialGrid = Array.from({ length: numRows }, () => Array(numInputs + 1).fill("-"));
                setUserGrid(initialGrid);
            } else if (clearTarget === 'kmap') {
                setKmapValues({});
            } else if (clearTarget === 'procedimiento') {
                setUserSteps('');
            } else if (clearTarget === 'final') {
                setUserFinal('');
            } else if (clearTarget === 'all') {
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const initialGrid = Array.from({ length: numRows }, () => Array(numInputs + 1).fill("-"));
                setUserGrid(initialGrid);
                setKmapValues({});
                setUserSteps('');
                setUserFinal('');
                setStatus('idle');
                setErrorMessages([]);
                setShowSolution(false);
                setHintsUsed(0);
            }
            setClearTarget(null);
        };

        const renderClearBtn = (handler) => (
            <button onClick={handler} className="text-text-muted hover:text-error transition ml-3 bg-surface p-2 rounded-full border border-white/5 shadow-sm hover:border-error/30" title="Limpiar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
        );

            return (

                <div className="min-h-screen relative max-w-full font-sans antialiased text-white selection:bg-[#af52de]/30 touch-smooth">
                    {/* Apple Frosted Glass Sticky Header */}
                    <header className="sticky top-0 z-40 w-full bg-[#09090b]/94 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
                            
                            {/* Left: Back + Title + Dynamic Counter */}
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
                                        Arquitectura del Computador
                                    </h1>
                                    <div className="flex items-center gap-2 text-xs font-mono font-medium truncate">
                                        <span className="text-[#c084fc]">
                                            Problema {currentIndex + 1} de {todosLosProblemas.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Reiniciar button & Reglas button */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <button 
                                    onClick={() => setClearTarget('all')} 
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] active:scale-90 transition-all shadow-sm touch-smooth"
                                    title="Reiniciar ejercicio actual"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                </button>

                                <button 
                                    onClick={() => setShowRules(true)} 
                                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm text-white/80 hover:text-white bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] active:scale-95 transition-all shadow-sm touch-smooth"
                                    title="Ver reglas del Álgebra de Boole"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    <span>Reglas</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Workspace with Apple Rubber-Band Overscroll */}
                    <main 
                        className="max-w-6xl mx-auto px-3 sm:px-6 md:px-12 pt-4 sm:pt-6 pb-28 sm:pb-36 flex flex-col gap-6 sm:gap-8 w-full"
                        style={{
                            transform: overscrollY !== 0 ? `translate3d(0, ${overscrollY}px, 0)` : undefined,
                            transition: isOverscrollReleasing ? 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                            willChange: overscrollY !== 0 ? 'transform' : 'auto'
                        }}
                    >
                        <div className={`flex flex-col space-y-6 sm:space-y-8 w-full transition-all duration-300 ${problemAnimClass}`}>
                            
                            <div className="glass-panel rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg w-full flex flex-col gap-2 border border-white/10 hover:border-white/20 transition-all">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-2 sm:mb-4">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-accent m-0 leading-snug">
                                        {currentProblem.title.includes(':') ? (
                                            <>
                                                <span className="uppercase">{currentProblem.title.split(':')[0]}</span>
                                                :{currentProblem.title.split(':').slice(1).join(':')}
                                            </>
                                        ) : (
                                            currentProblem.title
                                        )}
                                    </h2>
                                    <button 
                                        onClick={useHint} 
                                        disabled={hintsUsed >= 3 || status === 'correct'}
                                        className={`flex items-center gap-1.5 sm:gap-2 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl transition shadow-sm border whitespace-nowrap flex-shrink-0 text-xs sm:text-sm
                                            ${hintsUsed >= 3 || status === 'correct' ? 'bg-surface text-text-muted border-border cursor-not-allowed opacity-50' : 'bg-warning-soft text-warning border-warning-soft hover:border-warning active:scale-95'}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>
                                        {hintsUsed >= 3 ? 'Sin pistas' : `Pista (${3 - hintsUsed})`}
                                    </button>
                                </div>
                                <p className="text-text-muted whitespace-pre-line leading-relaxed text-sm sm:text-base md:text-lg mb-0">{currentProblem.description}</p>
                                
                                {hintsUsed > 0 && (
                                    <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                                        {currentProblem.hints.slice(0, hintsUsed).map((hint, idx) => (
                                            <div key={idx} className="bg-warning-soft border-l-4 border-l-warning p-3 sm:p-4 rounded-xl sm:rounded-2xl text-text-main text-xs sm:text-sm shadow-sm animate-fade-in">
                                                <span className="font-extrabold uppercase tracking-widest text-xs mr-2 text-warning">Pista {idx + 1}:</span> 
                                                <span className="font-medium text-sm sm:text-base">{hint}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
<div className="flex flex-col gap-1 w-full">
<div className="glass-panel rounded-t-3xl rounded-b-none p-4 sm:p-6 md:p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6 sm:mb-10">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-4 sm:mb-6 text-center flex items-center justify-center">Tabla de Verdad {renderClearBtn(handleClearTables)}</h3>
                                
                                
                                <div className="overflow-x-auto max-w-full flex justify-center pb-2">
                                    <table className="w-auto text-center border-separate border-spacing-0 bg-surface rounded-2xl overflow-hidden border border-border">
                                        <thead className="glass-panel">
                                            <tr>
                                                {inputs.map((inp, i) => (
                                                    <th key={i} className="py-2 px-4 sm:py-3 sm:px-8 border-b border-border text-text-main font-extrabold text-lg">{inp}</th>
                                                ))}
                                                <th className="py-2 px-4 sm:py-3 sm:px-8 border-b border-border text-white font-extrabold text-lg border-l-2 border-accent-soft bg-accent-soft">{output}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userGrid.map((row, rIndex) => (
                                                <tr key={rIndex} className="hover:bg-accent-soft transition-colors border-b border-border last:border-0">
                                                    {row.map((cell, cIndex) => {
                                                        const isOutputCell = cIndex === inputs.length;
                                                        return (
                                                            <td key={cIndex} className={`p-1 sm:p-3 ${isOutputCell ? 'border-l-2 border-accent-soft bg-accent-soft' : ''}`}>
                                                                <button 
                                                                    onClick={() => toggleCell(rIndex, cIndex)}
                                                                    className={getCellStyles(cell, rIndex, cIndex, isOutputCell)}
style={cell === '-' ? { borderColor: 'transparent', boxShadow: 'none', outline: 'none' } : {}}
                                                                >
                                                                    {cell}
                                                                </button>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                
                                </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-center mb-4 sm:mb-6">
                                            <h3 className="text-xl sm:text-2xl font-bold text-text-main text-center flex items-center justify-center">Mapa de Karnaugh {renderClearBtn(handleClearKMap)}</h3>
                                        </div>
                                        <div className="overflow-x-auto max-w-full flex justify-center items-start pb-2">
                                            {(() => {
                                                const kMapDims = getKMapDimensions(currentProblem.inputs.length);
                                                if (!kMapDims) return <p className="text-warning">Karnaugh no está disponible para este número de variables.</p>;
                                                
                                                return (
                                                    <table className="w-auto text-center border-separate border-spacing-0 bg-surface rounded-2xl overflow-hidden border border-border relative h-max">
                                                        <thead className="glass-panel">
                                                            <tr>
                                                                <th className="p-3 border-b-2 border-r-2 border-accent-soft bg-accent-soft text-white font-extrabold relative min-w-[80px] h-[60px]">
                                                                    <span className="absolute bottom-2 left-3 text-xs">{kMapDims.rowLabels}</span>
                                                                    <span className="absolute top-2 right-3 text-xs">{kMapDims.colLabels}</span>
                                                                    <svg className="absolute inset-0 w-full h-full text-white/20" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1"/></svg>
                                                                </th>
                                                                {kMapDims.cols.map((c, i) => (
                                                                    <th key={"c"+i} className="p-3 border-b-2 border-accent-soft bg-accent-soft text-white font-extrabold text-lg min-w-[50px]">{c}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {kMapDims.rows.map((r, rIdx) => (
                                                                <tr key={"r"+rIdx} className="hover:bg-accent-soft transition-colors border-b border-border last:border-0">
                                                                    <th className="p-3 border-r-2 border-accent-soft bg-accent-soft text-white font-extrabold text-lg">{r}</th>
                                                                    {kMapDims.cols.map((c, cIdx) => {
                                                                        const cellKey = r + c;
                                                                        return (
                                                                            <td key={cellKey} className="p-1 sm:p-3">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const current = kmapValues[cellKey] || '-';
                                                                                        let next = '0';
                                                                                        if (current === '0') next = '1';
                                                                                        else if (current === '1') next = '0';
                                                                                        setKmapValues(prev => ({...prev, [cellKey]: next}));
                                                                                    }}
                                                                                    className={`w-12 h-12 sm:w-16 sm:h-14 text-xl sm:text-2xl rounded-xl font-bold transition-all shadow-sm border outline-none mx-auto flex items-center justify-center ${(kmapValues[cellKey] || '-') === '-' ? 'bg-transparent text-white/20 hover:bg-white/5 border-transparent shadow-none' : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}
                                                                                >
                                                                                    {kmapValues[cellKey] || '-'}
                                                                                </button>
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="glass-panel rounded-none p-4 sm:p-6 md:p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="flex items-center justify-center mb-4 sm:mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-text-main text-center flex items-center justify-center">Procedimiento {renderClearBtn(handleClearProcedimiento)}</h3>
                                </div>
                                
                                
                                <div className="relative w-full h-44 sm:h-52 bg-surface rounded-2xl border border-border dark:border-white/10 focus-within:glass-panel focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/20 transition-all overflow-hidden">
                                    <div 
                                        ref={stepsUnderlayRef}
                                        className="absolute inset-0 p-3.5 sm:p-5 font-mono text-lg sm:text-2xl font-bold whitespace-pre-wrap break-words pointer-events-none overflow-hidden text-text-main"
                                        aria-hidden="true"
                                    >
                                        {userSteps ? (
                                            userSteps.split(new RegExp(`(${output})`, 'g')).map((part, i) => 
                                                part === output ? <span key={i} className="text-accent">{part}</span> : <span key={i}>{part}</span>
                                            )
                                        ) : (
                                            <span className="text-white/40">{output} = A'B + B'C + C'A</span>
                                        )}
                                    </div>
                                    
                                    <textarea 
                                        ref={stepsRef}
                                        value={userSteps}
                                        onChange={(e) => setUserSteps(e.target.value)}
                                        onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                        onScroll={(e) => { if (stepsUnderlayRef.current) stepsUnderlayRef.current.scrollTop = e.target.scrollTop; }}
                                        spellCheck="false"
                                        className="absolute inset-0 w-full h-full p-3.5 sm:p-5 outline-none resize-none bg-transparent text-transparent caret-white font-mono text-lg sm:text-2xl font-bold"
                                    />
                                </div>
                            </div>

                            <div className="glass-panel rounded-b-3xl rounded-t-none p-4 sm:p-6 md:p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="flex items-center justify-center mb-4 sm:mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-text-main text-center flex items-center justify-center">Función Lógica Final {renderClearBtn(handleClearFinal)}</h3>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 sm:mb-8 w-full">
                                    <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0 flex-1">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-accent whitespace-nowrap flex-shrink-0">{output} =</span>
                                        <input 
                                            ref={finalRef}
                                            type="text" 
                                            value={userFinal}
                                            onChange={(e) => setUserFinal(e.target.value)}
                                            onFocus={() => { setActiveInput('final'); setIsKeyboardOpen(true); }}
                                            placeholder="A + B + C" 
                                            className="flex-1 min-w-0 w-full p-3.5 sm:p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none text-lg sm:text-2xl text-text-main placeholder-white/40 font-mono font-bold transition-all"
                                        />
                                    </div>
                                    <InteractiveHoverButton onClick={checkAnswer} text="Comprobar solución" className="w-full sm:w-auto" />
                                </div>

                                


                                {/* BANNER DE ÉXITO Y BOTÓN SIGUIENTE */}
                                {status === 'correct' && (
                                    <div className="mt-6 p-6 bg-success-soft border-2 border-success-soft rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md animate-fade-in">
                                        <div className="flex items-start gap-4">
                                            <div className="text-success font-extrabold text-4xl">✓</div>
                                            <div>
                                                <h4 className="text-success font-extrabold text-xl">¡Aprobado!</h4>
                                                <p className="text-success mt-1 font-medium">Tabla, procedimiento matemático y simplificación 100% validados.</p>
                                            </div>
                                        </div>
                                        
                                        {currentIndex < todosLosProblemas.length - 1 ? (
                                            <button onClick={nextProblem} className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-text-main font-extrabold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-success-soft transition-transform active:scale-95 whitespace-nowrap border border-green-500">
                                                Siguiente Ejercicio ➔
                                            </button>
                                        ) : (
                                            <div className="bg-warning-soft text-warning border-warning-soft font-bold py-3 px-6 rounded-xl border text-center">
                                                🏆 ¡Has completado todos los ejercicios disponibles!
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* BANNER DE ERROR */}
                                {status === 'error' && (
                                    <div className="mt-6 p-6 bg-error-soft border-2 border-error-soft rounded-2xl flex flex-col gap-4 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                                        <div className="flex items-start gap-4">
                                            <div className="text-error font-extrabold text-3xl">✗</div>
                                            <div>
                                                <h4 className="text-error font-extrabold text-lg">Hemos encontrado errores en tu lógica:</h4>
                                                <ul className="list-disc list-inside text-error text-base mt-3 space-y-2 font-medium">
                                                    {errorMessages.map((msg, idx) => <li key={idx}>{msg}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 border-t border-error-soft pt-4">
                                            <button onClick={() => setShowSolution(!showSolution)} className="text-error bg-error-soft hover:bg-error/20 border-error-soft px-5 py-2 rounded-xl font-bold text-sm transition shadow-sm border border-error-soft">
                                                {showSolution ? 'Ocultar solución' : 'Me rindo, ver solución'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showSolution && status === 'error' && (
                                    <div className="mt-6 p-6 bg-surface hover:bg-accent-soft text-text-main rounded-2xl shadow-2xl border border-border animate-[fadeIn_0.3s_ease-out]">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                                            Solución Paso a Paso
                                        </h4>
                                        <div className="font-mono text-base whitespace-pre-line text-text-muted bg-surface p-5 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                                            {currentProblem.solutionSteps}
                                            <br/><br/>
                                            <span className="text-success font-extrabold text-xl">Resultado final: {currentProblem.finalExpression}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> {/* CIERRE DE GAP-1 */}
                    </div>
                </main>

                {/* Apple-Style Large Touch Target Bottom Dock */}
                <div className="fixed bottom-0 inset-x-0 z-40 bg-[#09090b]/94 backdrop-blur-md border-t border-white/[0.08] px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.45)]">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-3 w-full">
                        {/* 1. Anterior (Icon on mobile, icon+label on desktop) */}
                        <button
                            onClick={prevProblem}
                            className="w-12 sm:w-auto h-12 sm:h-13 px-0 sm:px-6 rounded-2xl font-semibold text-xs sm:text-sm text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] active:scale-[0.92] transition-transform duration-200 touch-smooth flex items-center justify-center gap-2 flex-shrink-0"
                            title={currentIndex === 0 ? "Primer problema (límite)" : "Problema anterior"}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 18-6-6 6-6"/></svg>
                            <span className="hidden sm:inline">Anterior</span>
                        </button>

                        {/* 2. Dynamic Problem Indicator */}
                        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-2">
                            <span className="text-xs sm:text-sm font-mono font-medium text-white/60 truncate">
                                Problema <strong className="text-white font-bold">{currentIndex + 1}</strong> de {todosLosProblemas.length}
                            </span>
                        </div>

                        {/* 3. Siguiente (SOLID PURPLE, Primary Apple Button) */}
                        <button
                            onClick={nextProblem}
                            className="flex-[1.2] sm:flex-initial sm:min-w-[140px] h-12 sm:h-13 px-4 sm:px-7 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-[0.92] transition-all duration-200 touch-smooth flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                            title={currentIndex === todosLosProblemas.length - 1 ? "Último problema (límite)" : "Siguiente problema"}
                        >
                            <span>Siguiente</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>

            {/* Apple Sheet Confirmation Modal to Clear/Reset */}
            {clearTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 animate-fade-in" onClick={() => setClearTarget(null)}></div>
                    <div className="bg-[#161618] relative rounded-[28px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-[0_24px_50px_rgba(0,0,0,0.7)] border border-white/[0.1] text-center flex flex-col gap-5 z-10 animate-modal-bounce">
                        <button onClick={() => setClearTarget(null)} className="absolute top-5 right-5 text-white/50 hover:text-white transition p-1 rounded-full hover:bg-white/[0.08]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        
                        <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto text-white/80 animate-spring-pop">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </div>

                        <div className="space-y-1.5">
                            <h2 className="text-xl font-bold tracking-tight text-white">¿Estás seguro?</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {clearTarget === 'tables' && "Esto borrará todos los datos ingresados en la Tabla de Verdad."}
                                {clearTarget === 'kmap' && "Esto borrará todos los datos ingresados en el Mapa de Karnaugh."}
                                {clearTarget === 'procedimiento' && "Esto borrará todo el texto ingresado en tu Procedimiento."}
                                {clearTarget === 'final' && "Esto borrará tu Función Lógica Final ingresada."}
                                {clearTarget === 'all' && "Esto reiniciará todo el problema actual a su estado inicial."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button 
                                onClick={() => setClearTarget(null)} 
                                className="flex-1 py-3 px-4 rounded-2xl font-semibold text-sm text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 transition-all touch-smooth"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={executeClear} 
                                className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-95 transition-all touch-smooth"
                            >
                                {clearTarget === 'all' ? 'Reiniciar' : 'Limpiar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Apple Sheet Rules Modal */}
            {showRules && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 animate-fade-in" onClick={() => setShowRules(false)}></div>
                    <div className="bg-[#161618] relative rounded-[28px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-[0_24px_50px_rgba(0,0,0,0.7)] border border-white/[0.1] text-left flex flex-col gap-5 z-10 animate-modal-bounce">
                        <button onClick={() => setShowRules(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition p-1 rounded-full hover:bg-white/[0.08]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xl flex-shrink-0">
                                💡
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-white">Reglas del Álgebra</h2>
                                <p className="text-xs font-mono text-white/50">3 Reglas Esenciales para Simplificar</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
                                <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-1">1. Idempotencia</h4>
                                <p className="font-mono text-lg text-white font-bold">A + A = A</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
                                <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-1">2. Complemento (Suma)</h4>
                                <p className="font-mono text-lg text-white font-bold">A + A' = 1</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
                                <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-1">3. Complem. (Multiplicación)</h4>
                                <p className="font-mono text-lg text-white font-bold">A &middot; A' = 0</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowRules(false)}
                            className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white bg-[#9333ea] hover:bg-[#a855f7] shadow-sm active:scale-95 transition-all touch-smooth mt-1"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}


            {/* TECLADO VIRTUAL FLOTANTE Y ARRASTRABLE */}
                    {isKeyboardOpen && (
                        <div 
                            className="fixed glass-panel border border-border dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl z-50 overflow-hidden flex flex-col"
                            style={{ 
                                left: kbPos.x, top: kbPos.y, 
                                width: '500px', maxWidth: '95vw',
                                touchAction: 'none',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)'
                            }}
                        >
                            <div 
                                className="bg-surface text-text-muted p-1 sm:p-3 flex justify-between items-center cursor-move border-b border-border"
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerCancel={onPointerUp}
                            >
                                <div className="flex items-center gap-2 pointer-events-none">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                                    <span className="font-bold text-sm tracking-widest uppercase">Teclado {activeInput === 'steps' ? 'Procedimiento' : 'Función'}</span>
                                </div>
                                <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsKeyboardOpen(false)} className="bg-error hover:bg-error/90 text-text-main rounded-full w-8 h-8 flex items-center justify-center font-bold transition shadow">✕</button>
                            </div>
                            
                            <div className="p-4 glass-panel">
                                <div className="grid grid-cols-10 gap-2 mb-2">
                                    {inputs.map(v => (
                                        <button key={v} onClick={() => handleKeyboardClick(v)} className="col-span-2 bg-surface hover:bg-accent-soft text-text-main font-black text-2xl py-3 rounded-xl shadow-sm border border-border transition-colors active:scale-95">{v}</button>
                                    ))}
                                    {activeInput !== 'final' && (
                                        <button onClick={() => handleKeyboardClick(output)} className="col-span-2 bg-accent/10 hover:bg-accent/20 text-white font-black text-2xl py-3 rounded-xl shadow-sm border border-white/20 transition-colors active:scale-95">{output}</button>
                                    )}
                                    {Array.from({length: Math.max(0, 5 - (inputs.length + (activeInput === 'final' ? 0 : 1)))}).map((_, i) => (
                                        <div key={'space'+i} className="col-span-2"></div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-6 gap-2 mb-2">
                                    <button onClick={() => handleKeyboardClick('+')} className="col-span-1 bg-surface hover:bg-accent-soft text-accent font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">+</button>
                                    <button onClick={() => handleKeyboardClick('·')} className="col-span-1 bg-surface hover:bg-accent-soft text-accent font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">·</button>
                                    <button onClick={() => handleKeyboardClick("'")} className="col-span-1 bg-surface hover:bg-black text-text-main font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">'</button>
                                    <button onClick={() => handleKeyboardClick('(')} className="col-span-1 bg-surface hover:bg-accent-soft text-accent font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">(</button>
                                    <button onClick={() => handleKeyboardClick(')')} className="col-span-1 bg-surface hover:bg-accent-soft text-accent font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">)</button>
                                    <button onClick={() => handleKeyboardClick('=')} className="col-span-1 bg-surface hover:bg-accent-soft text-accent font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">=</button>
                                </div>

                                <div className="grid grid-cols-8 gap-2">
                                    <button onClick={() => handleKeyboardClick('0')} className="col-span-1 bg-surface hover:bg-accent-soft hover:bg-surface hover:bg-accent-soft text-text-main font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">0</button>
                                    <button onClick={() => handleKeyboardClick('1')} className="col-span-1 bg-surface hover:bg-accent-soft hover:bg-surface hover:bg-accent-soft text-text-main font-bold py-3 rounded-xl shadow-sm border border-border active:scale-95">1</button>
                                    
                                    <button onClick={() => handleKeyboardClick(' ')} className="col-span-2 bg-surface hover:bg-accent-soft text-text-muted font-bold text-sm py-3 rounded-xl shadow-sm border border-border active:scale-95">Espacio</button>
                                    <button onClick={() => handleKeyboardClick('Enter')} className="col-span-2 bg-accent hover:bg-accent/90 text-text-main font-bold text-sm py-3 rounded-xl shadow-sm border border-accent active:scale-95">Enter</button>
                                    <button onClick={() => handleKeyboardClick('Backspace')} className="col-span-2 bg-error hover:bg-error/90 text-text-main font-bold text-xl py-3 rounded-xl shadow-sm border border-error active:scale-95 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" x2="12" y1="9" y2="15"/><line x1="12" x2="18" y1="9" y2="15"/></svg></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
