import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Header: remove gap, remove bg color, add blur
header_old = r'<div className="sticky top-0 z-40 bg-\[\#000000\]/80 backdrop-blur-xl border-b border-white/10 pb-4 pt-6 px-6 md:px-12 -mx-6 md:-mx-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">'
header_new = r'<div className="sticky top-0 z-50 bg-transparent backdrop-blur-[24px] border-b border-white/10 py-4 px-6 md:px-12 -mx-6 md:-mx-12 -mt-6 md:-mt-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">'
content = re.sub(header_old, header_new, content)

# 2. Update Truth Table initialization to '-'
init_old = r'const initialGrid = Array\.from\(\{ length: numRows \}, \(\) => Array\(numInputs \+ 1\)\.fill\(0\)\);'
init_new = r'const initialGrid = Array.from({ length: numRows }, () => Array(numInputs + 1).fill("-"));'
content = re.sub(init_old, init_new, content)

# 3. Update toggleCell logic for '-', '0', '1'
toggle_old = r'const toggleCell = \(rIndex, cIndex\) => \{.*?\};'
toggle_new = """const toggleCell = (rIndex, cIndex) => {
                const newGrid = [...userGrid];
                newGrid[rIndex] = [...newGrid[rIndex]];
                const currentVal = newGrid[rIndex][cIndex];
                if (currentVal === '-') newGrid[rIndex][cIndex] = 0;
                else if (currentVal === 0) newGrid[rIndex][cIndex] = 1;
                else newGrid[rIndex][cIndex] = 0;
                setUserGrid(newGrid);
                setStatus("idle"); 
            };"""
content = re.sub(toggle_old, toggle_new, content, flags=re.DOTALL)

# 4. Update checkAnswer to detect incomplete table
check_ans_old = r'const decimalValue = parseInt\(inputVals\.join\(\'\'\), 2\);'
check_ans_new = """if (row.includes('-')) {
                        errors.push("Tabla: Completa todos los valores de la tabla de verdad ('0' o '1').");
                        tableOutputsCorrect = false;
                        continue;
                    }
                    const decimalValue = parseInt(inputVals.join(''), 2);"""
content = re.sub(check_ans_old, check_ans_new, content)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("LogicLab.jsx updated with header fixes and partial truth table logic.")
