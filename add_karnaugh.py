import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State for Karnaugh
state_injection = """
            const [procedureMethod, setProcedureMethod] = useState('boole');
            const [kMapGrid, setKMapGrid] = useState([]);
            
            const getKMapDimensions = (numInputs) => {
                const inputs = currentProblem ? currentProblem.inputs : [];
                if (numInputs === 4) return { rows: ['00', '01', '11', '10'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2]+inputs[3], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 3) return { rows: ['0', '1'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 2) return { rows: ['0', '1'], cols: ['0', '1'], rowLabels: inputs[1], colLabels: inputs[0] };
                return null;
            };
"""
content = re.sub(r'const \[userFinal, setUserFinal\] = useState\(\'\'\);', state_injection.strip() + '\n            const [userFinal, setUserFinal] = useState(\'\');', content)

# 2. Reset KMap on new problem
reset_injection = """
                setProcedureMethod('boole');
                const dims = getKMapDimensions(currentProblem.inputs.length);
                if (dims) {
                    setKMapGrid(Array.from({ length: dims.rows.length }, () => Array(dims.cols.length).fill('-')));
                } else {
                    setKMapGrid([]);
                }
"""
content = re.sub(r'setUserSteps\(\'\'\);', reset_injection.strip() + '\n                setUserSteps(\'\');', content)

# 3. Update checkAnswer logic to handle procedureMethod
check_procedure_old = r'let mathLinesCount = 0;\s*let procErrors = \[\];\s*const lines = userSteps\.split\(\'\\n\'\)\.map\(l => l\.trim\(\)\)\.filter\(l => l !== \'\'\);\s*let initialVars = -1;\s*let strictMode = false;\s*let previousVars = -1;\s*for \(let i = 0; i < lines\.length; i\+\+\) \{.*?\} else if \(procErrors\.length > 0\) \{\s*errors\.push\(procErrors\[0\]\);\s*\}'

check_procedure_new = """
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
                    const lines = userSteps.split('\\n').map(l => l.trim()).filter(l => l !== '');
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
"""

content = re.sub(check_procedure_old, check_procedure_new.strip(), content, flags=re.DOTALL)

# 4. Inject the UI switcher and KMap rendering
ui_old = r'<h3 className="text-lg font-bold text-text-main mb-4">2\. Procedimiento \(Álgebra de Boole\)</h3>\s*<textarea'

ui_new = """
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-text-main">2. Procedimiento</h3>
                                    <div className="flex bg-surface rounded-xl p-1 border border-border">
                                        <button 
                                            onClick={() => setProcedureMethod('boole')}
                                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${procedureMethod === 'boole' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            Álgebra de Boole
                                        </button>
                                        <button 
                                            onClick={() => setProcedureMethod('karnaugh')}
                                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${procedureMethod === 'karnaugh' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            Mapa de Karnaugh
                                        </button>
                                    </div>
                                </div>
                                
                                {procedureMethod === 'boole' && (
                                    <textarea 
"""

content = re.sub(ui_old, ui_new.strip(), content)

# Close the textarea and add Karnaugh map rendering
textarea_end = r'className="w-full h-40 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none mb-8 text-text-main font-mono text-lg leading-relaxed transition-all"\s*/>'

kmap_ui = """className="w-full h-40 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none mb-8 text-text-main font-mono text-lg leading-relaxed transition-all"
                                    />
                                )}

                                {procedureMethod === 'karnaugh' && (
                                    <div className="mb-8 animate-fade-in">
                                        <p className="text-sm text-text-muted mb-4 font-medium">Llena el mapa de Karnaugh. Luego agrupa visualmente los '1's y escribe la función simplificada en el Paso 3.</p>
                                        <div className="overflow-x-auto flex justify-center lg:justify-start">
                                            {(() => {
                                                const kMapDims = getKMapDimensions(currentProblem.inputs.length);
                                                if (!kMapDims) return <p className="text-warning">Karnaugh no está disponible para este número de variables.</p>;
                                                
                                                return (
                                                    <table className="w-auto text-center border-collapse bg-surface rounded-2xl overflow-hidden shadow-inner border border-border relative">
                                                        <thead className="glass-panel">
                                                            <tr>
                                                                <th className="py-3 px-4 border-b border-r border-border text-text-muted font-bold relative min-w-[80px]">
                                                                    <div className="absolute top-2 right-3 text-xs">{kMapDims.colLabels}</div>
                                                                    <div className="absolute bottom-2 left-3 text-xs">{kMapDims.rowLabels}</div>
                                                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/></svg>
                                                                </th>
                                                                {kMapDims.cols.map((col, i) => (
                                                                    <th key={i} className="py-3 px-6 border-b border-border text-text-main font-bold">{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {kMapDims.rows.map((row, rIndex) => (
                                                                <tr key={rIndex} className="border-b border-border last:border-0">
                                                                    <th className="py-3 px-6 border-r border-border glass-panel text-text-main font-bold">{row}</th>
                                                                    {kMapDims.cols.map((col, cIndex) => {
                                                                        const cell = kMapGrid[rIndex] ? kMapGrid[rIndex][cIndex] : '-';
                                                                        const decimalValue = parseInt(col + row, 2);
                                                                        const correctValue = currentProblem.correctTable[decimalValue];
                                                                        
                                                                        let style = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";
                                                                        if (cell === '-') style += "bg-transparent text-white/20 border-white/5 hover:bg-white/5";
                                                                        else if (cell === correctValue) style += "bg-transparent text-white border-green-500";
                                                                        else style += "bg-transparent text-white border-red-500";
                                                                        
                                                                        return (
                                                                            <td key={cIndex} className="p-3">
                                                                                <button 
                                                                                    onClick={() => {
                                                                                        const newK = [...kMapGrid];
                                                                                        newK[rIndex] = [...newK[rIndex]];
                                                                                        const current = newK[rIndex][cIndex];
                                                                                        if (current === '-') newK[rIndex][cIndex] = 0;
                                                                                        else if (current === 0) newK[rIndex][cIndex] = 1;
                                                                                        else newK[rIndex][cIndex] = 0;
                                                                                        setKMapGrid(newK);
                                                                                        setStatus('idle');
                                                                                    }}
                                                                                    className={style}
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
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
"""

content = re.sub(textarea_end, kmap_ui.strip(), content)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Karnaugh Map feature injected.")
