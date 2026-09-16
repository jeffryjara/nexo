import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add step state
state_injection = """
            const [currentStep, setCurrentStep] = useState(1);
            
            const [tableErrors, setTableErrors] = useState([]);
            const [procErrorsState, setProcErrorsState] = useState([]);
"""
content = re.sub(r'const \[userGrid, setUserGrid\] = useState\(\[\]\);', state_injection + '\n            const [userGrid, setUserGrid] = useState([]);', content)

# Reset step on new problem
reset_injection = """
                setCurrentStep(1);
                setTableErrors([]);
                setProcErrorsState([]);
"""
content = re.sub(r'setUserGrid\(initialGrid\);', reset_injection + '\n                setUserGrid(initialGrid);', content)

# Split checkAnswer logic
check_answer_old = r'const checkAnswer = \(\) => \{.*?\n\s+let tableOutputsCorrect = true;.*?\n\s+if \(!errorFound\) \{\n\s+setStatus\(\'correct\'\);\n\s+\} else \{\n\s+setStatus\(\'error\'\);\n\s+\}\n\s+\};'
check_answer_new = """
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
                        errors.push("Tabla: Completa todos los valores de la tabla de verdad ('0' o '1').");
                        tableOutputsCorrect = false;
                        continue;
                    }
                    const decimalValue = parseInt(inputVals.join(''), 2);
                    foundCombinations.add(decimalValue);
                    
                    if (outputVal !== correctT[decimalValue]) {
                        tableOutputsCorrect = false;
                    }
                }

                if (foundCombinations.size !== numRows) {
                    errors.push("Tabla: Tienes filas repetidas o te faltan combinaciones de entrada.");
                } else if (!tableOutputsCorrect) {
                    errors.push("Tabla: Algunas salidas no son correctas para las combinaciones dadas.");
                }
                
                if (errors.length === 0) {
                    setTableErrors([]);
                    setCurrentStep(2);
                } else {
                    setTableErrors(errors);
                    setStatus('error');
                    setErrorMessages(errors);
                }
            };
            
            const checkProcedure = () => {
                let procErrors = [];
                const lines = userSteps.split('\\n').map(l => l.trim()).filter(l => l !== '');
                if (lines.length === 0) {
                    procErrors.push("Procedimiento: Escribe al menos un paso de simplificación.");
                }
                
                if (procErrors.length === 0) {
                    setProcErrorsState([]);
                    setCurrentStep(3);
                } else {
                    setProcErrorsState(procErrors);
                    setStatus('error');
                    setErrorMessages(procErrors);
                }
            };

            const checkAnswer = () => {
                let errors = [];
                // We assume Table is correct if we reached step 3.
                
                if (userFinal.trim() === '') {
                    errors.push("Función Final: No has escrito la función simplificada.");
                    setStatus('error');
                    setErrorMessages(errors);
                    return;
                }
                
                // Evaluate boolean logic
                let isFunctionCorrect = true;
                try {
                    const parsedFinal = userFinal.replace(/'/g, "_NOT_"); 
                    // Basic sanity check, the real boolean evaluator is in the old checkAnswer.
                    // We will preserve the boolean evaluator logic.
"""

# Let me first check how the boolean evaluator is implemented in the old checkAnswer.
