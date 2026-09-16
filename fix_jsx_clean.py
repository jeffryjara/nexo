import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find everything from `<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>`
# to the start of the virtual keyboard `{/* TECLADO VIRTUAL FLOTANTE Y ARRASTRABLE */}`
# and I'll clean it up to ensure it's a single contiguous block.

# First, let's remove `<div className="animate-fade-in">`
content = content.replace('<div className="animate-fade-in">\n<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>', '<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>')
content = content.replace('</div>\n<div className="animate-fade-in">\n<h3 className="text-lg font-bold text-text-main mb-4">2. Procedimiento', '<h3 className="text-lg font-bold text-text-main mb-4">2. Procedimiento')
content = content.replace('</div>\n<div className="animate-fade-in">\n<h3 className="text-lg font-bold text-text-main mb-4">3. Función Lógica Final</h3>', '<h3 className="text-lg font-bold text-text-main mb-4">3. Función Lógica Final</h3>')

# And remove the stray `</div>\n)}` at the end
content = content.replace('</div>\n)}\n\n                                <div className="flex items-center justify-center gap-2 mt-12 border-t border-white/5 pt-8">', '\n                                <div className="flex items-center justify-center gap-2 mt-12 border-t border-white/5 pt-8">')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
