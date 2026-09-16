import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the onClick crash when kMapGrid is not properly initialized
crash_old = r"""const newK = \[\.\.\.kMapGrid\];\s*newK\[rIndex\] = \[\.\.\.newK\[rIndex\]\];\s*const current = newK\[rIndex\]\[cIndex\];"""
crash_new = """const newK = [...kMapGrid];
                                                                                        if (!newK[rIndex]) newK[rIndex] = Array(kMapDims.cols.length).fill('-');
                                                                                        newK[rIndex] = [...newK[rIndex]];
                                                                                        const current = newK[rIndex][cIndex];"""
content = re.sub(crash_old, crash_new, content)

# Also let's fix the initial state so it never starts empty if we know the dimensions
init_old = r"const \[kMapGrid, setKMapGrid\] = useState\(\[\]\);"
init_new = """const [kMapGrid, setKMapGrid] = useState(() => {
                const inputs = todosLosProblemas[0].inputs;
                let rows = 0; let cols = 0;
                if (inputs.length === 4) { rows = 4; cols = 4; }
                else if (inputs.length === 3) { rows = 2; cols = 4; }
                else if (inputs.length === 2) { rows = 2; cols = 2; }
                return Array.from({ length: rows }, () => Array(cols).fill('-'));
            });"""
content = content.replace("const [kMapGrid, setKMapGrid] = useState([]);", init_new)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
