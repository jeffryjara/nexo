import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Fix the Top Border of the Tables Card
# Let's do a very simple and safe replace.
nexo = nexo.replace('<div className="flex flex-col gap-1 w-full">\n<div className="glass-panel rounded-none p-8 shadow-lg"', '<div className="flex flex-col gap-1 w-full">\n<div className="glass-panel rounded-t-3xl rounded-b-none p-8 shadow-lg"')

# 2. Fix the Footer width and hide logic
old_footer = r'''                        \{\/\* Paginación en card separada \*\/\}
                        <div className="relative group rounded-full overflow-hidden w-full flex justify-center border border-white/5 shadow-\[0_8px_32px_rgba\(168,85,247,0\.15\)\] hover:shadow-\[0_8px_32px_rgba\(168,85,247,0\.3\)\] bg-\[#a855f7\]/10 hover:bg-\[#a855f7\]/15 backdrop-blur-md transition-all duration-500 p-4">
                            <InductionCardEffect className="absolute inset-0 z-0 pointer-events-none" />
                            <div className="relative z-10 flex w-full justify-center">
                                <div className="flex items-center justify-center gap-6 w-auto flex-nowrap">
                                    <button 
                                        onClick=\{prevProblem\} 
                                        disabled=\{currentIndex === 0\}
                                        className="hover:text-white text-text-muted disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2\.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Anterior
                                    </button>
                                    
                                    <div className="text-white/50 font-bold text-sm tracking-widest whitespace-nowrap opacity-75">
                                        \{currentIndex \+ 1\} / \{todosLosProblemas\.length\}
                                    </div>
                                    
                                    <button 
                                        onClick=\{nextProblem\} 
                                        disabled=\{currentIndex === todosLosProblemas\.length - 1\}
                                        className="hover:text-white text-text-muted disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                    >
                                        Siguiente <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2\.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>'''

new_footer = r'''                        {/* Paginación en card separada */}
                        <div className="w-full flex justify-center">
                            <div className="relative group rounded-full overflow-hidden w-fit flex justify-center border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 backdrop-blur-md transition-all duration-500 p-4 px-8">
                                <InductionCardEffect className="absolute inset-0 z-0 pointer-events-none" />
                                <div className="relative z-10 flex w-full justify-center">
                                    <div className="flex items-center justify-center gap-6 w-auto flex-nowrap">
                                        {currentIndex > 0 && (
                                            <button 
                                                onClick={prevProblem} 
                                                className="hover:text-white text-text-muted font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Anterior
                                            </button>
                                        )}
                                        
                                        <div className="text-white/50 font-bold text-sm tracking-widest whitespace-nowrap opacity-75">
                                            {currentIndex + 1} / {todosLosProblemas.length}
                                        </div>
                                        
                                        {currentIndex < todosLosProblemas.length - 1 && (
                                            <button 
                                                onClick={nextProblem} 
                                                className="hover:text-white text-text-muted font-bold py-2 px-4 rounded-full transition flex items-center gap-2 whitespace-nowrap"
                                            >
                                                Siguiente <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>'''

nexo = re.sub(old_footer, new_footer, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
