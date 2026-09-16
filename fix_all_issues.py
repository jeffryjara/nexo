import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Fix Modal Text and Logic
# Change text for 'tables'
nexo = nexo.replace("{clearTarget === 'tables' && \"Esto borrará todos los datos ingresados en la Tabla de Verdad y el Mapa de Karnaugh.\"}", 
"{clearTarget === 'tables' && \"Esto borrará todos los datos ingresados en la Tabla de Verdad.\"}")

# Fix executeClear logic
old_logic = """        const executeClear = () => {
            if (clearTarget === 'tables') {
                resetGrid(currentProblem);
                setKmapValues({});
            } else if (clearTarget === 'kmap') {
                setKmapValues({});
            } else if (clearTarget === 'procedimiento') {
                setUserSteps('');
            } else if (clearTarget === 'final') {
                setUserFinal('');
            }
            setClearTarget(null);
        };"""

new_logic = """        const executeClear = () => {
            if (clearTarget === 'tables') {
                const numInputs = currentProblem.inputs.length;
                const numRows = Math.pow(2, numInputs);
                const initialGrid = Array.from({ length: numRows }, () => Array(numInputs + 1).fill("-"));
                setUserGrid(initialGrid);
            } else if (clearTarget === 'kmap') {
                setKmapValues({});
            } else if (clearTarget === 'procedimiento') {
                setUserSteps('');
            } else if (clearTarget === 'final') {
                setUserFinal('');
            }
            setClearTarget(null);
        };"""

nexo = nexo.replace(old_logic, new_logic)

# 2. Add renderClearBtn to Procedimiento
nexo = nexo.replace('<h3 className="text-2xl font-bold text-text-main text-center">Procedimiento</h3>',
'<h3 className="text-2xl font-bold text-text-main text-center flex items-center justify-center">Procedimiento {renderClearBtn(handleClearProcedimiento)}</h3>')

# 3. Fix the Pagination layout
# We will just replace the exact line that makes it w-full.
# Current: <div className="relative group rounded-full overflow-hidden w-full flex justify-center border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 backdrop-blur-md transition-all duration-500 p-4">
nexo = nexo.replace('<div className="relative group rounded-full overflow-hidden w-full flex justify-center border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 backdrop-blur-md transition-all duration-500 p-4">',
'<div className="w-full flex justify-center">\n                            <div className="relative group rounded-full overflow-hidden w-fit flex justify-center border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 backdrop-blur-md transition-all duration-500 p-4 px-10">')

# Wait, if we wrap it in a new div, we must also add a closing div!
# Currently the Pagination block ends with:
#                                 </div>
#                             </div>
#                         </div>
# 
#             {clearTarget && (
# So we need to add a closing div before {clearTarget
# Actually, the original Pagination block had 3 closing divs:
#                                 </div> (ends gap-6 flex-nowrap)
#                             </div> (ends relative z-10)
#                         </div> (ends relative group rounded-full)
# If we wrap the `relative group rounded-full` in `w-full flex justify-center`, we add one more closing div!
pattern = r'(                                </div>\n                            </div>\n                        </div>\n        \n\n            \{clearTarget && \()'
replacement = r'                                </div>\n                            </div>\n                        </div>\n                        </div>\n        \n\n            {clearTarget && ('
nexo = re.sub(pattern, replacement, nexo)

# 4. Hide the Prev/Next buttons conditionally!
# Currently it has:
# <button \n                                        onClick={prevProblem} \n                                        disabled={currentIndex === 0}\n                                        className="hover:text-white text-text-muted disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"\n                                    >\n                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Anterior\n                                    </button>
prev_btn_old = r'''                                    <button 
                                        onClick={prevProblem} 
                                        disabled={currentIndex === 0}
                                        className="hover:text-white text-text-muted disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Anterior
                                    </button>'''

prev_btn_new = r'''                                    {currentIndex > 0 && (
                                        <button 
                                            onClick={prevProblem} 
                                            className="hover:text-white text-text-muted font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Anterior
                                        </button>
                                    )}'''

nexo = nexo.replace(prev_btn_old, prev_btn_new)

next_btn_old = r'''                                    <button 
                                        onClick={nextProblem} 
                                        disabled={currentIndex === todosLosProblemas.length - 1}
                                        className="hover:text-white text-text-muted disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                    >
                                        Siguiente <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                    </button>'''

next_btn_new = r'''                                    {currentIndex < todosLosProblemas.length - 1 && (
                                        <button 
                                            onClick={nextProblem} 
                                            className="hover:text-white text-text-muted font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                        >
                                            Siguiente <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </button>
                                    )}'''

nexo = nexo.replace(next_btn_old, next_btn_new)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
