import re
with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const lines = userSteps.split(" in line:
        pass # Wait, it spans two lines now

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will just replace the exact broken chunk
bad_chunk = "const lines = userSteps.split('\\n')\n').map(l => l.trim()).filter(l => l !== '');"
bad_chunk_2 = "const lines = userSteps.split('\n').map(l => l.trim()).filter(l => l !== '');"
good_chunk = "const lines = userSteps.split('\\n').map(l => l.trim()).filter(l => l !== '');"

content = content.replace("const lines = userSteps.split('\\n')\n').map(l => l.trim()).filter(l => l !== '');", good_chunk)
content = content.replace("const lines = userSteps.split('\n\n').map(l => l.trim()).filter(l => l !== '');", good_chunk)
content = content.replace("const lines = userSteps.split('\n').map(l => l.trim()).filter(l => l !== '');", good_chunk)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
