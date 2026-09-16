import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the giant 3-step block with conditional steps
# I will use Python regex to match the table, procedure, and final blocks, and wrap them in {currentStep === 1 && ... }

# Find the Table section
table_start = content.find('<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>')
proc_start = content.find('<h3 className="text-lg font-bold text-text-main mb-4">2. Procedimiento (Álgebra de Boole)</h3>')
final_start = content.find('<h3 className="text-lg font-bold text-text-main mb-4">3. Función Lógica Final</h3>')
button_start = content.find('<div className="flex flex-wrap items-center gap-4 justify-between w-full mt-6">')
button_end = content.find('</div>\n\n                                {/* BANNER DE ÉXITO Y BOTÓN SIGUIENTE */}')

if table_start != -1 and proc_start != -1 and final_start != -1 and button_start != -1:
    table_html = content[table_start:proc_start]
    proc_html = content[proc_start:final_start]
    final_html = content[final_start:button_start]
    
    # I need to insert the specific buttons for each step
    step1_buttons = """
                                {currentStep === 1 && (
                                    <div className="flex justify-end mt-4">
                                        <button onClick={checkTable} className="bg-accent hover:bg-accent/90 text-text-main font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent">
                                            Comprobar Tabla y Continuar &rarr;
                                        </button>
                                    </div>
                                )}
"""
    
    step2_buttons = """
                                {currentStep === 2 && (
                                    <div className="flex flex-wrap gap-4 justify-between mt-4">
                                        <button onClick={() => setCurrentStep(1)} className="glass-panel text-text-main font-bold py-3 px-6 rounded-xl hover:bg-accent-soft transition-colors border border-border">
                                            &larr; Volver a la Tabla
                                        </button>
                                        <button onClick={checkProcedure} className="bg-accent hover:bg-accent/90 text-text-main font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent">
                                            Comprobar y Continuar &rarr;
                                        </button>
                                    </div>
                                )}
"""

    step3_buttons = """
                                {currentStep === 3 && (
                                    <div className="flex flex-wrap gap-4 justify-between mt-4">
                                        <button onClick={() => setCurrentStep(2)} className="glass-panel text-text-main font-bold py-3 px-6 rounded-xl hover:bg-accent-soft transition-colors border border-border">
                                            &larr; Volver al Procedimiento
                                        </button>
                                        <button onClick={checkFinal} className="bg-green-600 hover:bg-green-500 text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-transform active:scale-95 border border-green-400">
                                            Comprobar Ejercicio Completo
                                        </button>
                                    </div>
                                )}
"""

    # Also we keep the global next/prev buttons at the very bottom
    global_nav = """
                                <div className="flex items-center justify-center gap-2 mt-12 border-t border-white/5 pt-8">
                                    <button 
                                        onClick={prevProblem} 
                                        disabled={currentIndex === 0}
                                        className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition border border-white/5"
                                    >
                                        &larr; Problema Anterior
                                    </button>
                                    <div className="bg-surface text-text-main border border-white/10 font-bold py-3 px-6 rounded-xl shadow-sm text-lg text-center min-w-[100px]">
                                        {currentIndex + 1} / {todosLosProblemas.length}
                                    </div>
                                    <button 
                                        onClick={nextProblem} 
                                        disabled={currentIndex === todosLosProblemas.length - 1}
                                        className="glass-panel hover:bg-accent-soft text-text-main disabled:opacity-30 disabled:cursor-not-allowed font-bold py-3 px-5 rounded-xl shadow-sm transition border border-white/5"
                                    >
                                        Siguiente Problema &rarr;
                                    </button>
                                </div>
"""

    new_section = (
        "{currentStep === 1 && (\n<div className=\"animate-fade-in\">\n" + table_html + step1_buttons + "</div>\n)}\n" +
        "{currentStep === 2 && (\n<div className=\"animate-fade-in\">\n" + proc_html + step2_buttons + "</div>\n)}\n" +
        "{currentStep === 3 && (\n<div className=\"animate-fade-in\">\n" + final_html + step3_buttons + "</div>\n)}\n" +
        global_nav
    )
    
    # Replace the old section
    content = content[:table_start] + new_section + content[button_end + 6:] # +6 for </div>\n

    with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Steps implemented successfully.")
else:
    print("Could not find sections.")
