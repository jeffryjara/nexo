import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix invisible titles (revert gradients)
title_broken = '<h1 className="text-3xl font-extrabold bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent tracking-tight">Arquitectura del Computador</h1>'
title_fixed = '<h1 className="text-3xl font-extrabold text-white tracking-tight">Arquitectura del Computador</h1>'
content = content.replace(title_broken, title_fixed)

prob_title_broken = '<h2 className="text-xl font-extrabold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-4 pl-2">{currentProblem.title}</h2>'
prob_title_fixed = '<h2 className="text-xl font-extrabold text-white mb-4 pl-2">{currentProblem.title}</h2>'
content = content.replace(prob_title_broken, prob_title_fixed)

# 2. Revert the Step-by-step logic
# We need to remove `{currentStep === X && (` and its closing `)}`
# And replace the step buttons with the single Comprobar Solucion button
content = content.replace('{currentStep === 1 && (\\n<div className="animate-fade-in">', '<div className="animate-fade-in">')
content = content.replace('{currentStep === 1 && (\n<div className="animate-fade-in">', '<div className="animate-fade-in">')
content = content.replace('{currentStep === 2 && (\n<div className="animate-fade-in">', '<div className="animate-fade-in">')
content = content.replace('{currentStep === 3 && (\n<div className="animate-fade-in">', '<div className="animate-fade-in">')

# To cleanly restore, I will use regex to find the step buttons and remove them, then insert the old Comprobar Solucion block.
step1_btn = re.search(r'<div className="flex justify-end mt-4">.*?Comprobar Tabla y Continuar &rarr;.*?</button>\s*</div>\s*\)}\s*', content, flags=re.DOTALL)
if step1_btn:
    content = content.replace(step1_btn.group(0), '')

step2_btn = re.search(r'<div className="flex flex-wrap gap-4 justify-between mt-4">.*?Comprobar y Continuar &rarr;.*?</button>\s*</div>\s*\)}\s*', content, flags=re.DOTALL)
if step2_btn:
    content = content.replace(step2_btn.group(0), '')

step3_btn = re.search(r'<div className="flex flex-wrap gap-4 justify-between mt-4">.*?Comprobar Ejercicio Completo.*?</button>\s*</div>\s*\)}\s*', content, flags=re.DOTALL)
if step3_btn:
    # Replace step 3 buttons with the old unified Comprobar Solucion block
    unified_btn = """
                                <div className="flex flex-wrap items-center gap-4 justify-between w-full mt-6">
                                    <button onClick={checkAnswer} className="bg-white hover:bg-gray-200 text-black font-extrabold text-lg py-4 px-10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all active:scale-95 border border-transparent">
                                        Comprobar Solución
                                    </button>
                                </div>
"""
    content = content.replace(step3_btn.group(0), unified_btn)

# Ensure checkAnswer is restored to its full glory
check_answer_full = """
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

                let mathLinesCount = 0;
                let procErrors = [];
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
"""

# Replace the checkTable, checkProcedure, checkFinal with the unified checkAnswer
check_table_block = re.search(r'const checkTable = \(\) => \{.*?const checkFinal = \(\) => \{.*?\n\s+\};\n', content, flags=re.DOTALL)
if check_table_block:
    content = content.replace(check_table_block.group(0), check_answer_full)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Wizard reverted successfully.")
