import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update "Comprobar Tabla y Continuar" button
content = content.replace('bg-accent hover:bg-accent/90 text-text-main font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent', 'bg-white hover:bg-gray-200 text-black font-extrabold text-lg py-4 px-10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all active:scale-95 border border-transparent')

# Update "Comprobar Ejercicio Completo" button
content = content.replace('bg-green-600 hover:bg-green-500 text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-transform active:scale-95 border border-green-400', 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-extrabold text-lg py-4 px-10 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 border border-transparent')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Buttons updated.")
