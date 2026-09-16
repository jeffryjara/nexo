with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Procedimiento Placeholder and Height
procedimiento_old = """<textarea 
                                    value={userSteps}
                                    onChange={(e) => setUserSteps(e.target.value)}
                                    onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                    placeholder="Ej:\\nS = T'P + TP\\nS = P(T' + T)\\n..." 
                                    className="w-full h-40 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-lg leading-relaxed transition-all"
                                />"""

procedimiento_new = """<div className="relative w-full">
                                    {!userSteps && (
                                        <div className="absolute top-5 left-5 pointer-events-none text-text-muted/60 text-lg font-mono leading-relaxed">
                                            Ej: <br/>
                                            <span className="text-accent font-bold">{output}</span> = A'B + B'C + C'A
                                        </div>
                                    )}
                                    <textarea 
                                        value={userSteps}
                                        onChange={(e) => setUserSteps(e.target.value)}
                                        onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                        className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-lg leading-relaxed transition-all"
                                    />
                                </div>"""

nexo = nexo.replace(procedimiento_old, procedimiento_new)

# 3. Comprobar Button
btn_old = """<button onClick={handleVerify} className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-white bg-accent hover:bg-accent/90 border border-accent hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center min-w-[200px]">
                                        Comprobar Solución
                                    </button>"""

btn_new = """<button onClick={handleVerify} className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-white bg-accent hover:bg-accent/90 border border-accent hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-3 min-w-[200px]">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                        Comprobar
                                    </button>"""

nexo = nexo.replace(btn_old, btn_new)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
