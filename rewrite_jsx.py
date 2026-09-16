import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up header buttons and text
content = re.sub(r'className="text-4xl font-extrabold text-black dark:text-white tracking-tight"', 'className="text-4xl font-extrabold text-text-main tracking-tight"', content)
content = re.sub(r'className="text-slate-500 dark:text-gray-400 font-medium mt-1"', 'className="text-text-muted font-medium mt-1"', content)

# Header toggle button
content = re.sub(r'className="bg-slate-200 hover:bg-slate-300 dark:bg-darkcard dark:hover:bg-\[#151515\] text-slate-700 dark:text-gray-300 font-bold py-2 px-4 rounded-xl border border-slate-300 dark:border-darkborder shadow-sm transition flex items-center justify-center"', 'className="glass-panel hover:bg-accent-soft text-text-main font-bold py-2 px-4 rounded-xl shadow-sm transition flex items-center justify-center"', content)

# Header pagination buttons
content = re.sub(r'className="bg-white dark:bg-darkcard\/70 dark:backdrop-blur-2xl hover:bg-slate-100 dark:hover:bg-\[#111\] text-slate-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-xl border border-slate-300 dark:border-darkborder shadow-sm transition"', 'className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-xl shadow-sm transition"', content)

# Header pagination indicator
content = re.sub(r'className="bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900\/40 dark:text-indigo-300 dark:border-indigo-700\/50 font-bold py-2 px-6 rounded-xl border shadow-sm text-lg text-center min-w-\[120px\]"', 'className="bg-accent-soft text-accent border border-accent/20 font-bold py-2 px-6 rounded-xl shadow-sm text-lg text-center min-w-[120px]"', content)

# 2. Main cards (Problema, Tabla, Formato)
content = re.sub(r'className="bg-white dark:bg-darkcard\/70 dark:backdrop-blur-2xl rounded-3xl p-8 shadow-lg border border-slate-300 dark:border-darkborder relative overflow-hidden"', 'className="glass-panel rounded-3xl p-8 shadow-lg relative overflow-hidden"', content)
content = re.sub(r'className="bg-white dark:bg-darkcard\/70 dark:backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-lg border border-slate-300 dark:border-darkborder"', 'className="glass-panel rounded-3xl p-6 md:p-8 shadow-lg"', content)

# 3. Typography inside cards
content = re.sub(r'className="text-xl font-bold text-black dark:text-white mb-4 pl-2"', 'className="text-xl font-bold text-text-main mb-4 pl-2"', content)
content = re.sub(r'className="text-slate-700 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-2 text-lg mb-6"', 'className="text-text-muted whitespace-pre-line leading-relaxed pl-2 text-lg mb-6"', content)

# Dividers
content = re.sub(r'border-slate-300 dark:border-darkborder', 'border-border', content)
content = re.sub(r'border-slate-400 dark:border-gray-700', 'border-border', content)

# 4. Hints section
content = re.sub(r"className=\{`flex items-center gap-2 font-bold py-2 px-4 rounded-xl transition shadow-sm border\s+\$\{hintsUsed >= 3 \|\| status === 'correct' \? 'bg-slate-700 text-slate-500 border-border cursor-not-allowed' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-400 dark:bg-amber-900\/40 dark:hover:bg-amber-800\/50 dark:text-amber-300 dark:border-amber-700 active:scale-95'\}!`\}", 
                 r"className={`flex items-center gap-2 font-bold py-2 px-4 rounded-xl transition shadow-sm border ${hintsUsed >= 3 || status === 'correct' ? 'opacity-50 cursor-not-allowed bg-surface text-text-muted border-border' : 'bg-warning-soft text-warning border-warning/30 hover:border-warning/50 active:scale-95'}`}", content)

content = re.sub(r'className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-900 dark:bg-amber-900\/20 dark:text-amber-200 text-sm shadow-sm animate-\[fadeIn_0.3s_ease-out\]"', 'className="bg-warning-soft border-l-4 border-warning p-4 rounded-r-xl text-text-main text-sm shadow-sm animate-fade-in"', content)
content = re.sub(r'className="font-extrabold uppercase tracking-widest text-xs mr-2 text-amber-700 dark:text-amber-500"', 'className="font-extrabold uppercase tracking-widest text-xs mr-2 text-warning"', content)

# 5. Table styling
content = re.sub(r'bg-slate-100 dark:bg-\[#030303\]', 'bg-surface', content)
content = re.sub(r'text-black dark:text-white', 'text-text-main', content)
content = re.sub(r'bg-indigo-100 dark:bg-indigo-900\/40', 'bg-accent-soft', content)
content = re.sub(r'text-indigo-700 dark:text-indigo-300', 'text-accent', content)

content = re.sub(r'className="bg-white dark:bg-darkcard\/70 hover:bg-slate-50 dark:hover:bg-\[#111\] text-black dark:text-white font-black text-xl py-3 rounded-xl border border-border shadow-sm transition-colors active:scale-95"', 'className="bg-surface hover:bg-accent-soft text-text-main font-black text-xl py-3 rounded-xl border border-border shadow-sm transition-colors active:scale-95"', content)
content = re.sub(r'className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xl py-3 rounded-xl border border-indigo-600 shadow-sm transition-colors active:scale-95"', 'className="bg-accent hover:bg-accent-hover text-white font-black text-xl py-3 rounded-xl border border-accent shadow-sm transition-colors active:scale-95"', content)
content = re.sub(r'className="bg-indigo-900\/40 hover:bg-indigo-800\/60 text-indigo-300 font-black text-xl py-3 rounded-xl border border-indigo-500\/50 shadow-sm transition-colors active:scale-95"', 'className="bg-accent-soft text-accent hover:bg-accent/20 font-black text-xl py-3 rounded-xl border border-accent/50 shadow-sm transition-colors active:scale-95"', content)

# 6. Inputs and textareas
content = re.sub(r'focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500\/20', 'focus:border-accent focus:ring-4 focus:ring-accent/20', content)
content = re.sub(r'bg-slate-50 border-2 border-green-400 dark:bg-green-900\/20 dark:border-green-700\/50', 'bg-success-soft border-2 border-success/50', content)
content = re.sub(r'bg-slate-50 border-2 border-red-400 dark:bg-red-900\/20 dark:border-red-800\/50', 'bg-error-soft border-2 border-error/50', content)
content = re.sub(r'bg-slate-100 dark:bg-\[#030303\] border-2 border-border', 'bg-surface border-2 border-border', content)

# Check button
content = re.sub(r'className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-\[0.98\] border border-indigo-500 mt-2"', 'className="w-full bg-accent hover:bg-accent-hover text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] border border-transparent mt-2"', content)

# 7. Success/Error panels
content = re.sub(r'bg-green-50 border-2 border-green-400 dark:bg-green-900\/20 dark:border-green-700\/50', 'bg-success-soft border-2 border-success/50', content)
content = re.sub(r'text-green-600 dark:text-green-500', 'text-success', content)
content = re.sub(r'text-green-700 dark:text-green-400', 'text-success', content)
content = re.sub(r'text-green-800 dark:text-green-300', 'text-success', content)
content = re.sub(r'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-500', 'bg-success hover:opacity-90 text-white', content)
content = re.sub(r'border-green-600\/50', 'border-success/50', content)
content = re.sub(r'animate-\[fadeIn_0.5s_ease-out\]', 'animate-fade-in', content)

content = re.sub(r'bg-red-50 border-2 border-red-400 dark:bg-red-900\/20 dark:border-red-800\/50', 'bg-error-soft border-2 border-error/50', content)
content = re.sub(r'text-red-600 dark:text-red-500', 'text-error', content)
content = re.sub(r'text-red-700 dark:text-red-400', 'text-error', content)
content = re.sub(r'text-red-800 dark:text-red-300', 'text-error', content)
content = re.sub(r'bg-red-200 hover:bg-red-300 dark:bg-red-900\/40 dark:hover:bg-red-800\/60', 'bg-error-soft hover:bg-error/20 border-error/50', content)

# Keyboard
content = re.sub(r'className="fixed bg-white dark:bg-darkcard\/70 dark:backdrop-blur-2xl border border-border shadow-\[0_20px_50px_rgba\(0,0,0,0.5\)\] rounded-2xl z-50 overflow-hidden flex flex-col"', 'className="fixed glass-panel shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl z-50 overflow-hidden flex flex-col"', content)
content = re.sub(r'bg-slate-700 hover:bg-slate-600 text-black dark:text-white', 'bg-surface hover:bg-accent-soft text-text-main', content)
content = re.sub(r'bg-slate-700 hover:bg-slate-600 text-indigo-300', 'bg-surface hover:bg-accent-soft text-accent', content)
content = re.sub(r'bg-slate-700 hover:bg-slate-600 text-slate-700 dark:text-gray-300', 'bg-surface hover:bg-accent-soft text-text-muted', content)
content = re.sub(r'bg-slate-100 dark:bg-\[#030303\] hover:bg-black', 'bg-surface hover:bg-accent-soft', content)
content = re.sub(r'border-slate-950', 'border-border', content)

# Side panel formulas
content = re.sub(r'bg-amber-100 dark:bg-amber-900\/50 flex items-center justify-center text-2xl shadow-sm border border-amber-300 dark:border-amber-700\/50', 'bg-warning-soft flex items-center justify-center text-2xl shadow-sm border border-warning/30', content)
content = re.sub(r'bg-slate-100\/80 dark:bg-\[#050505\]\/80 dark:backdrop-blur-3xl p-5 rounded-2xl border border-border shadow-sm transition hover:bg-white dark:bg-darkcard\/70 dark:backdrop-blur-2xl', 'glass-panel p-5 rounded-2xl shadow-sm transition hover:bg-surface hover:border-accent/30', content)


# Save refactored JSX
with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("LogicLab.jsx refactored.")
