import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix main wrapper padding
content = content.replace('className="min-h-screen p-6 md:p-12 relative"', 'className="min-h-screen pb-6 md:pb-12 px-6 md:px-12 relative"')

# Fix header
header_old = r'<div className="sticky top-0 z-50 bg-transparent backdrop-blur-\[24px\] border-b border-white/10 py-4 px-6 md:px-12 -mx-6 md:-mx-12 -mt-6 md:-mt-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">'
header_new = r'<div className="sticky top-0 z-50 bg-transparent backdrop-blur-[24px] border-b border-white/10 py-6 px-6 md:px-12 -mx-6 md:-mx-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">'
content = re.sub(header_old, header_new, content)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Layout padding fixed.")
