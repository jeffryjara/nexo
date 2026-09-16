import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove stray `{currentStep === X && (`
content = re.sub(r'\{currentStep === \d && \(\s*', '', content)
# Remove stray `)}` that might be left over. We have to be careful not to break valid JSX.
# Actually, since I know exactly where they are: between the `</div>` of the table and `<div className="animate-fade-in">` of the next.
content = re.sub(r'</div>\s*\)\}\s*<div className="animate-fade-in">', '</div>\n<div className="animate-fade-in">', content)

# I can also just completely reconstruct that part.
with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
