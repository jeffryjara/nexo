import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

pattern = r'<div className="relative w-full">\s*\{!userSteps && \(\s*<div className="absolute top-5 left-5 pointer-events-none text-text-muted/60 text-lg font-mono leading-relaxed">\s*Ej:<br/>\s*<span className="text-accent font-bold">\{output\}</span> = A\'B \+ B\'C \+ C\'A\s*</div>\s*\)\}\s*<textarea\s*ref=\{stepsRef\}\s*value=\{userSteps\}\s*onChange=\{\(e\) => setUserSteps\(e\.target\.value\)\}\s*onFocus=\{\(\) => \{ setActiveInput\(\'steps\'\); setIsKeyboardOpen\(true\); \}\}\s*className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-lg leading-relaxed transition-all"\s*/>\s*</div>'

replacement = r'''<div className="relative w-full">
                                    {!userSteps && (
                                        <div className="absolute top-5 left-5 pointer-events-none text-text-muted/50 text-2xl font-mono font-bold">
                                            <span className="text-accent">{output}</span> = A'B + B'C + C'A
                                        </div>
                                    )}
                                    <textarea 
                                        ref={stepsRef}
                                        value={userSteps}
                                        onChange={(e) => setUserSteps(e.target.value)}
                                        onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                        className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-2xl font-bold transition-all"
                                    />
                                </div>'''

nexo = re.sub(pattern, replacement, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
