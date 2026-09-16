import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State machine initialization
state_injection = """
            const [currentStep, setCurrentStep] = useState(1);
            const [tableErrors, setTableErrors] = useState([]);
            const [procErrors, setProcErrors] = useState([]);
            const [finalErrors, setFinalErrors] = useState([]);
"""
if "const [currentStep" not in content:
    content = content.replace('const [userGrid, setUserGrid] = useState([]);', state_injection + 'const [userGrid, setUserGrid] = useState([]);')

# 2. Reset step on new problem
reset_code = """
                setCurrentStep(1);
                setTableErrors([]);
                setProcErrors([]);
                setFinalErrors([]);
"""
if "setCurrentStep(1)" not in content:
    content = content.replace('setUserGrid(initialGrid);', reset_code + 'setUserGrid(initialGrid);')

# 3. Replace the entire checkAnswer with 3 separate checks
checkers = """
            const checkTable = () => {
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
                        errors.push("Completa todos los valores ('0' o '1').");
                        tableOutputsCorrect = false;
                        continue;
                    }
                    const decimalValue = parseInt(inputVals.join(''), 2);
                    foundCombinations.add(decimalValue);
                    if (outputVal !== correctT[decimalValue]) tableOutputsCorrect = false;
                }

                if (foundCombinations.size !== numRows) {
                    errors.push("Faltan combinaciones o hay repetidas.");
                } else if (!tableOutputsCorrect) {
                    errors.push("Algunas salidas no son correctas.");
                }
                
                if (errors.length === 0) {
                    setTableErrors([]);
                    setCurrentStep(2);
                    setStatus("idle");
                } else {
                    setTableErrors(errors);
                    setStatus("error");
                    setErrorMessages(errors);
                }
            };
            
            const checkProcedure = () => {
                let errors = [];
                let mathLinesCount = 0;
                const lines = userSteps.split('\\n').map(l => l.trim()).filter(l => l !== '');
                
                let initialVars = -1;
                let strictMode = false;
                let previousVars = -1;
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const correctT = currentProblem.correctTable;

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
                                errors.push(`Línea ${i+1}: ${evalResult.error}.`);
                                lineHasMathError = true;
                                break;
                            }
                            if (evalResult.result !== expected) {
                                errors.push(`Línea ${i+1}: Es lógicamente incorrecta.`);
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
                                errors.push(`Línea ${i+1}: Orden ilógico (añadiendo variables).`);
                                break;
                            }
                            if (currentVars < initialVars) strictMode = true; 
                            previousVars = currentVars;
                        }
                    }
                }

                if (mathLinesCount < currentProblem.minLines) {
                    errors.push(`Debes mostrar mínimo ${currentProblem.minLines} línea(s) de desarrollo.`);
                }
                
                if (errors.length === 0) {
                    setProcErrors([]);
                    setCurrentStep(3);
                    setStatus("idle");
                } else {
                    setProcErrors(errors);
                    setStatus("error");
                    setErrorMessages(errors);
                }
            };

            const checkFinal = () => {
                let errors = [];
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const correctT = currentProblem.correctTable;
                
                if (userFinal.trim() === '') {
                    errors.push("El recuadro del resultado está vacío.");
                } else {
                    let finalError = false;
                    for (let r = 0; r < numRows; r++) {
                        const values = getBinaryRow(r, numInputs);
                        const expected = correctT[r];
                        const evalResult = evaluarBooleano(userFinal, currentProblem.inputs, values);
                        if (evalResult.error) {
                            errors.push(evalResult.error);
                            finalError = true;
                            break;
                        }
                        if (evalResult.result !== expected) {
                            errors.push("Tu resultado no equivale a la función lógica correcta.");
                            finalError = true;
                            break;
                        }
                    }
                    if (!finalError) {
                        const normalizedFinal = userFinal.replace(/\s+/g, '').toLowerCase();
                        if (!currentProblem.acceptableFinals.includes(normalizedFinal) && !currentProblem.acceptableFinals.some(a => a.includes(normalizedFinal))) {
                            errors.push("La expresión es correcta pero no parece estar simplificada al máximo.");
                        }
                    }
                }

                if (errors.length === 0) {
                    setFinalErrors([]);
                    setStatus("correct");
                    setIsKeyboardOpen(false); 
                } else {
                    setFinalErrors(errors);
                    setStatus("error");
                    setErrorMessages(errors);
                }
            };
"""

check_answer_block = re.search(r'const checkAnswer = \(\) => \{.*?setStatus\("error"\);\s*setErrorMessages\(errors\);\s*\}\s*\};', content, flags=re.DOTALL)
if check_answer_block:
    content = content.replace(check_answer_block.group(0), checkers)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Checkers injected.")
