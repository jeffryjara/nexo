import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

helper_function = """
            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                const baseStyle = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";
                if (cell === '-') {
                    return baseStyle + "glass-panel text-white/20 border-white/5 hover:bg-white/5";
                }
                
                const numInputs = currentProblem.inputs.length;
                let correctValue;
                if (!isOutputCell) {
                    correctValue = (rIndex >> (numInputs - 1 - cIndex)) & 1;
                } else {
                    correctValue = currentProblem.correctTable[rIndex];
                }
                
                if (cell === correctValue) {
                    return baseStyle + "bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:bg-green-500/20";
                } else {
                    return baseStyle + "bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:bg-red-500/20";
                }
            };
"""

# Insert helper function before toggleCell
content = content.replace('const toggleCell =', helper_function.strip() + '\n\n            const toggleCell =')

# Replace the button rendering
old_button_regex = r'<button\s*onClick=\{\(\) => toggleCell\(rIndex, cIndex\)\}\s*className=\{`toggle-btn.*?`\}\s*>\s*\{cell\}\s*</button>'
new_button = """<button 
                                                                    onClick={() => toggleCell(rIndex, cIndex)}
                                                                    className={getCellStyles(cell, rIndex, cIndex, isOutputCell)}
                                                                >
                                                                    {cell}
                                                                </button>"""

content = re.sub(old_button_regex, new_button, content, flags=re.DOTALL)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Truth table cell styles updated.")
