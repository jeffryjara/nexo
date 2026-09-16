import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix "AL =" wrapping
content = content.replace('className="text-3xl font-extrabold text-indigo-400 w-16 text-right"', 'className="text-3xl font-extrabold text-accent whitespace-nowrap min-w-[3rem] text-right flex-shrink-0"')

# Fix textarea border
content = content.replace('border-2 border-border bg-surface', 'border border-border bg-surface dark:border-white/10')
# Final input border
content = content.replace('p-5 rounded-2xl border-2 border-border bg-surface', 'p-5 rounded-2xl border border-border bg-surface dark:border-white/10')

# Keyboard wrapper border
content = content.replace('fixed glass-panel shadow', 'fixed glass-panel border border-border dark:border-white/10 shadow')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("LogicLab.jsx UI fixed.")
