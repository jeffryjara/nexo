import React, { useState, useEffect, useRef } from 'react';
import { GlowCard } from './ui/spotlight-card';
import { todosLosProblemas } from '../data/problems';
import { evaluarBooleano, countVariables } from '../utils/engine';

export default function NexoLab() {

            

            

                const [scrolled, setScrolled] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [kmapValues, setKmapValues] = useState({});
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                
                if (cell === correctValue) {
                    return baseStyle + "bg-transparent text-white border-green-500";
                } else {
                    return baseStyle + "bg-transparent text-white border-red-500";
                }
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
                if (currentIndex < todosLosProblemas.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                }
            };

            const prevProblem = () => {
                if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                }
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

            return (
                <div className="min-h-screen pb-6 md:pb-12 px-6 md:px-12 relative">
            <div 
                        className={`sticky z-50 mx-auto w-full mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            scrolled 
                            ? 'max-w-5xl top-4 rounded-full px-6 md:px-8 py-3 bg-[#a855f7]/30 backdrop-blur-[100px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10' 
                            : 'max-w-6xl top-0 rounded-b-[2.5rem] px-6 md:px-10 py-5 bg-[#a855f7]/5 backdrop-blur-[24px] border-b border-white/5'
                        }`}
                    >
                        <div className="w-full flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-4">
                                        <a href="/" className="text-text-muted hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5" title="Volver a Mis Cursos">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                        </a>
                                        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>
                                    </div>
                                </div>
                    <button onClick={() => setShowRules(true)} className="glass-panel px-5 py-2.5 rounded-xl font-bold text-sm text-white/50 hover:text-accent transition flex items-center gap-2 border border-white/10 hover:border-accent hover:bg-accent/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Reglas</button>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full">
                        <div className="flex flex-col space-y-8 w-full">
                            
                            <GlowCard tiltLevel="low" customSize={true} glowColor="purple" className="!bg-[#09090b] !border-none !p-0 !rounded-3xl !relative !overflow-hidden !w-full !shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
    <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#a855f7_100%)] opacity-80 z-0"></div>
    <div className="absolute inset-[2px] bg-[#09090b] rounded-3xl z-0"></div>
    <div className="absolute inset-[2px] bg-[#a855f7]/10 backdrop-blur-md rounded-3xl z-0"></div>
    <div className="relative z-10 p-8 w-full flex flex-col h-full gap-2">
        <h2 className="text-xl font-bold text-accent mb-4 pl-2">{currentProblem.title}</h2>
                                <p className="text-text-muted whitespace-pre-line leading-relaxed pl-2 text-lg mb-6">{currentProblem.description}</p>
                                
                                <div className="pl-2 border-t border-border pt-4 mt-2">
                                    <button 
                                        onClick={useHint} 
                                        disabled={hintsUsed >= 3 || status === 'correct'}
                                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-xl transition shadow-sm border
                                            ${hintsUsed >= 3 || status === 'correct' ? 'bg-surface text-text-muted border-border cursor-not-allowed opacity-50' : 'bg-warning-soft text-warning border-warning-soft hover:border-warning active:scale-95'}`}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>
                                        {hintsUsed >= 3 ? 'Sin pistas restantes' : `Usar Pista (${3 - hintsUsed} restantes)`}
                                    </button>

                                    {hintsUsed > 0 && (
                                        <div className="mt-4 space-y-3">
                                            {currentProblem.hints.slice(0, hintsUsed).map((hint, idx) => (
                                                <div key={idx} className="bg-warning-soft border-l-4 border-warning p-4 rounded-r-xl text-text-main text-sm shadow-sm animate-fade-in">
                                                    <span className="font-extrabold uppercase tracking-widest text-xs mr-2 text-warning">Pista {idx + 1}:</span> 
                                                    <span className="font-medium text-base">{hint}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
    </div>
</GlowCard>

                            <div className="glass-panel rounded-3xl p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>
                                
                                
                                <div className="overflow-x-auto mb-10 flex justify-center lg:justify-start">
                                    <table className="w-auto text-center border-collapse bg-surface rounded-2xl overflow-hidden  border border-border">
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
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-text-main">2. Mapa de Karnaugh</h3>
                                        </div>
                                        <div className="overflow-x-auto flex justify-center lg:justify-start flex-1">
                                            {(() => {
                                                const kMapDims = getKMapDimensions(currentProblem.inputs.length);
                                                if (!kMapDims) return <p className="text-warning">Karnaugh no está disponible para este número de variables.</p>;
                                                
                                                return (
                                                    <table className="w-auto text-center border-collapse bg-surface rounded-2xl overflow-hidden border border-border relative">
                                                        <thead className="glass-panel">
                                                            <tr>
                                                                <th className="p-3 border-b border-r border-border text-text-muted font-bold relative min-w-[60px]">
                                                                    <span className="absolute bottom-1 left-2 text-xs">{kMapDims.rowLabels}</span>
                                                                    <span className="absolute top-1 right-2 text-xs">{kMapDims.colLabels}</span>
                                                                    <svg className="absolute inset-0 w-full h-full text-border" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1"/></svg>
                                                                </th>
                                                                {kMapDims.cols.map((c, i) => (
                                                                    <th key={"c"+i} className="p-3 border-b border-border text-text-main font-bold min-w-[50px]">{c}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {kMapDims.rows.map((r, rIdx) => (
                                                                <tr key={"r"+rIdx}>
                                                                    <th className="p-3 border-r border-border text-text-main font-bold glass-panel">{r}</th>
                                                                    {kMapDims.cols.map((c, cIdx) => {
                                                                        const cellKey = r + c;
                                                                        return (
                                                                            <td key={cellKey} className="p-1 sm:p-3 border border-border">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const current = kmapValues[cellKey] || '-';
                                                                                        let next = '0';
                                                                                        if (current === '0') next = '1';
                                                                                        else if (current === '1') next = '0';
                                                                                        setKmapValues(prev => ({...prev, [cellKey]: next}));
                                                                                    }}
                                                                                    className={`w-12 h-12 sm:w-16 sm:h-14 text-xl sm:text-2xl rounded-xl font-bold transition-all shadow-sm border outline-none mx-auto flex items-center justify-center ${(kmapValues[cellKey] || '-') === '-' ? 'bg-transparent text-white/20 hover:bg-white/5 border-transparent shadow-none' : 'bg-transparent text-white border-accent'}`}
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

                                <div className="border-t border-white/5 pt-8 mb-4">
                                    <h3 className="text-lg font-bold text-text-main mb-4">3. Procedimiento (Álgebra de Boole)</h3>
                                    
                                </div>
                                
                                
                                    <textarea 
                                    ref={stepsRef}
                                    value={userSteps}
                                    onChange={(e) => setUserSteps(e.target.value)}
                                    onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                    placeholder="Ej:\nS = T'P + TP\nS = P(T' + T)\n..." 
                                    className="w-full h-40 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none mb-8 text-text-main font-mono text-lg leading-relaxed transition-all"
                                    />

                                

                                
                                <h3 className="text-lg font-bold text-text-main mb-4">3. Función Lógica Final</h3>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                                    <div className="flex flex-1 items-center gap-4 w-full">
                                        <span className="text-3xl font-extrabold text-accent whitespace-nowrap min-w-[3rem] text-right flex-shrink-0">{output} =</span>
                                        <input 
                                            ref={finalRef}
                                            type="text" 
                                            value={userFinal}
                                            onChange={(e) => setUserFinal(e.target.value)}
                                            onFocus={() => { setActiveInput('final'); setIsKeyboardOpen(true); }}
                                            placeholder="Ej: A'B + C" 
                                            className="flex-1 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none text-2xl text-text-main font-mono font-bold transition-all"
                                        />
                                    </div>
                                    <button onClick={checkAnswer} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold text-lg py-5 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent whitespace-nowrap">
                                        Comprobar Solución
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 mt-12 border-t border-white/5 pt-8">
                                    <button 
                                        onClick={prevProblem} 
                                        disabled={currentIndex === 0}
                                        className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition border border-white/5"
                                    >
                                        <span className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Problema Anterior</span>
                                    </button>
                                    <div className="bg-surface text-text-main border border-white/10 font-bold py-3 px-6 rounded-xl shadow-sm text-lg text-center min-w-[100px]">
                                        {currentIndex + 1} / {todosLosProblemas.length}
                                    </div>
                                    <button 
                                        onClick={nextProblem} 
                                        disabled={currentIndex === todosLosProblemas.length - 1}
                                        className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition border border-white/5"
                                    >
                                        <span className="flex items-center gap-2">Siguiente Problema <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
                                    </button>
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
                        </div>

                        </div>
        
            {showRules && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRules(false)}></div>
                    <div className="glass-panel relative rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                        <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-text-muted hover:text-white transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-warning-soft flex items-center justify-center text-2xl shadow-sm border border-warning-soft">💡</div>
                            <h2 className="text-2xl font-extrabold text-text-main">Reglas</h2>
                        </div>
                        <p className="text-text-muted text-base mb-6 leading-relaxed font-medium">Recuerda estas 3 reglas del Álgebra de Boole para simplificar:</p>
                        
                        <div className="space-y-4">
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">1. Idempotencia</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A + A = A</p>
                            </div>
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">2. Complemento (Suma)</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A + A' = 1</p>
                            </div>
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">3. Complem. (Mult.)</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A · A' = 0</p>
                            </div>
                        </div>
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
                                    <span className="font-bold text-sm tracking-widest uppercase">Teclado {activeInput === 'steps' ? 'Procedimiento' : 'Final'}</span>
                                </div>
                                <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsKeyboardOpen(false)} className="bg-error hover:bg-error/90 text-text-main rounded-full w-8 h-8 flex items-center justify-center font-bold transition shadow">✕</button>
                            </div>
                            
                            <div className="p-4 glass-panel">
                                <div className="grid grid-cols-10 gap-2 mb-2">
                                    {inputs.map(v => (
                                        <button key={v} onClick={() => handleKeyboardClick(v)} className="col-span-2 bg-surface hover:bg-accent-soft text-text-main font-black text-2xl py-3 rounded-xl shadow-sm border border-border transition-colors active:scale-95">{v}</button>
                                    ))}
                                    <button onClick={() => handleKeyboardClick(output)} className="col-span-2 bg-accent/10 hover:bg-accent/20 text-white font-black text-2xl py-3 rounded-xl shadow-sm border border-white/20 transition-colors active:scale-95">{output}</button>
                                    {Array.from({length: Math.max(0, 5 - (inputs.length + 1))}).map((_, i) => (
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
                                    <button onClick={() => handleKeyboardClick('Enter')} className="col-span-2 bg-accent hover:bg-accent/90 text-text-main font-bold text-sm py-3 rounded-xl shadow-sm border border-accent active:scale-95">Enter ↵</button>
                                    <button onClick={() => handleKeyboardClick('Backspace')} className="col-span-2 bg-warning hover:bg-warning/90 text-text-main font-bold text-xl py-3 rounded-xl shadow-sm border border-warning active:scale-95 flex items-center justify-center">⌫</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
