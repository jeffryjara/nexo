import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

pattern = r'<div className="relative w-full">\s*\{!userSteps && \(\s*<div className="absolute top-5 left-5 pointer-events-none opacity-40 text-white text-2xl font-mono font-bold">\s*<span className="text-accent">\{output\}</span> = A\'B \+ B\'C \+ C\'A\s*</div>\s*\)\}\s*<textarea\s*ref=\{stepsRef\}\s*value=\{userSteps\}\s*onChange=\{\(e\) => setUserSteps\(e\.target\.value\)\}\s*onFocus=\{\(\) => \{ setActiveInput\(\'steps\'\); setIsKeyboardOpen\(true\); \}\}\s*className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-2xl font-bold transition-all"\s*/>\s*</div>'

replacement = r'''<div className="relative w-full h-52 bg-surface rounded-2xl border border-border dark:border-white/10 focus-within:glass-panel focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/20 transition-all overflow-hidden">
                                    <div 
                                        ref={stepsUnderlayRef}
                                        className="absolute inset-0 p-5 font-mono text-2xl font-bold whitespace-pre-wrap break-words pointer-events-none overflow-hidden text-text-main"
                                        aria-hidden="true"
                                    >
                                        {userSteps ? (
                                            userSteps.split(new RegExp(`(${output})`, 'g')).map((part, i) => 
                                                part === output ? <span key={i} className="text-accent">{part}</span> : <span key={i}>{part}</span>
                                            )
                                        ) : (
                                            <span className="text-white/40">{output} = A'B + B'C + C'A</span>
                                        )}
                                    </div>
                                    
                                    <textarea 
                                        ref={stepsRef}
                                        value={userSteps}
                                        onChange={(e) => setUserSteps(e.target.value)}
                                        onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                        onScroll={(e) => { if (stepsUnderlayRef.current) stepsUnderlayRef.current.scrollTop = e.target.scrollTop; }}
                                        spellCheck="false"
                                        className="absolute inset-0 w-full h-full p-5 outline-none resize-none bg-transparent text-transparent caret-white font-mono text-2xl font-bold"
                                    />
                                </div>'''

nexo = re.sub(pattern, replacement, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
