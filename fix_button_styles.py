import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add style={{ borderColor: 'transparent', boxShadow: 'none', outline: 'none' }} to the K-Map and Truth Table empty buttons
content = content.replace(
    'className={getCellStyles(cell, rIndex, cIndex, isOutputCell)}',
    'className={getCellStyles(cell, rIndex, cIndex, isOutputCell)}\nstyle={cell === \'-\' ? { borderColor: \'transparent\', boxShadow: \'none\', outline: \'none\' } : {}}'
)

content = content.replace(
    'const newK = [...kMapGrid];',
    'const newK = [...kMapGrid];'
)
# For the K-Map button:
# <button onClick={() => { ... }} className={style}>
content = content.replace(
    '<button \n                                                                                    onClick={() => {\n                                                                                        const newK = [...kMapGrid];',
    '<button \n                                                                                    style={cell === \'-\' ? { borderColor: \'transparent\', boxShadow: \'none\', outline: \'none\' } : {}}\n                                                                                    onClick={() => {\n                                                                                        const newK = [...kMapGrid];'
)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
