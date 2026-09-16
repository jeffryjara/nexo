import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    astro_content = f.read()

# Force dark mode in index.astro
astro_content = astro_content.replace('<html lang="es">', '<html lang="es" class="dark">')
with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(astro_content)

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    jsx_content = f.read()

# 1. Remove isDarkMode state and logic
jsx_content = re.sub(r'const \[isDarkMode, setIsDarkMode\] = useState\(.*?\);.*?\}, \[\]\);\s*useEffect\(\(\) => \{.*?\}, \[isDarkMode\]\);', '', jsx_content, flags=re.DOTALL)
jsx_content = re.sub(r'const toggleDarkMode = \(\) => setIsDarkMode\(!isDarkMode\);', '', jsx_content)

# 2. Re-write the header section
header_old = r'<div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-border">.*?</div>\s*</div>'
header_new = """
                    <div className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/10 pb-4 pt-6 px-6 md:px-12 -mx-6 md:-mx-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>
                                <p className="text-text-muted font-medium mt-1">Preparación Examen T1</p>
                            </div>
                        </div>
                    </div>
"""
jsx_content = re.sub(header_old, header_new.strip(), jsx_content, flags=re.DOTALL)

# 3. Replace the Comprobar section
comprobar_old = r'<div className="flex flex-wrap items-center gap-4">\s*<button onClick=\{checkAnswer\}.*?>\s*Comprobar Solución\s*</button>\s*</div>'
comprobar_new = """
                                <div className="flex flex-wrap items-center gap-4 justify-between w-full mt-6">
                                    <button onClick={checkAnswer} className="bg-accent hover:bg-accent/90 text-text-main font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent">
                                        Comprobar Solución
                                    </button>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={prevProblem} 
                                            disabled={currentIndex === 0}
                                            className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition"
                                        >
                                            &larr; Anterior
                                        </button>
                                        <div className="bg-surface text-text-main border border-white/10 font-bold py-3 px-6 rounded-xl shadow-sm text-lg text-center min-w-[100px]">
                                            {currentIndex + 1} / {todosLosProblemas.length}
                                        </div>
                                        <button 
                                            onClick={nextProblem} 
                                            disabled={currentIndex === todosLosProblemas.length - 1}
                                            className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition"
                                        >
                                            Siguiente &rarr;
                                        </button>
                                    </div>
                                </div>
"""
jsx_content = re.sub(comprobar_old, comprobar_new.strip(), jsx_content, flags=re.DOTALL)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx_content)

print("LogicLab.jsx updated with new sticky header and layout.")
