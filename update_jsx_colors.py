import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all bg-slate-* and bg-gray-*
content = re.sub(r'bg-slate-\d+', 'bg-surface hover:bg-accent-soft', content)
content = re.sub(r'bg-gray-\d+', 'bg-surface hover:bg-accent-soft', content)

# Replace indigo/blue buttons
content = re.sub(r'bg-indigo-600 hover:bg-indigo-500', 'bg-accent hover:bg-accent/90', content)
content = re.sub(r'bg-indigo-500', 'bg-accent', content)
content = re.sub(r'border-indigo-500', 'border-accent', content)

# Replace orange
content = re.sub(r'bg-orange-600 hover:bg-orange-500', 'bg-warning hover:bg-warning/90', content)
content = re.sub(r'border-orange-500', 'border-warning', content)

# Replace red
content = re.sub(r'bg-red-[456]00( hover:bg-red-[456]00)?', 'bg-error hover:bg-error/90', content)
content = re.sub(r'border-red-[456]00', 'border-error', content)
content = re.sub(r'text-red-[456]00', 'text-error', content)

# Clean up text-white on light backgrounds
# A generic replace for text-text-main in keyboard
content = content.replace('text-text-main font-black text-2xl', 'text-text-main font-black text-2xl')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("LogicLab.jsx updated.")
