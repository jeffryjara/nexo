with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

import re

# We can just replace the whole textarea block using regex with DOTALL
pattern_textarea = r'<textarea \s*ref=\{stepsRef\}\s*value=\{userSteps\}\s*onChange=\{\(e\) => setUserSteps\(e\.target\.value\)\}\s*onFocus=\{\(\) => \{ setActiveInput\(\'steps\'\); setIsKeyboardOpen\(true\); \}\}\s*placeholder="[^"]+"\s*className="[^"]+"\s*/>'

replacement_textarea = r'''<div className="relative w-full">
                                    {!userSteps && (
                                        <div className="absolute top-5 left-5 pointer-events-none text-text-muted/60 text-lg font-mono leading-relaxed">
                                            Ej:<br/>
                                            <span className="text-accent font-bold">{output}</span> = A'B + B'C + C'A
                                        </div>
                                    )}
                                    <textarea 
                                        ref={stepsRef}
                                        value={userSteps}
                                        onChange={(e) => setUserSteps(e.target.value)}
                                        onFocus={() => { setActiveInput('steps'); setIsKeyboardOpen(true); }}
                                        className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-lg leading-relaxed transition-all"
                                    />
                                </div>'''

nexo = re.sub(pattern_textarea, replacement_textarea, nexo)

# Final function placeholder
final_old = r'placeholder="Ej: A\'B \+ C"'
final_new = r'placeholder="Ej: A + B + C"'
nexo = re.sub(final_old, final_new, nexo)

# Comprobar button
btn_old = r'<button onClick=\{checkAnswer\} className="([^"]+)">\s*Comprobar Solución\s*</button>'
btn_new = r'''<button onClick={checkAnswer} className="\1 flex items-center justify-center gap-3">\n                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>\n                                        Comprobar\n                                    </button>'''
nexo = re.sub(btn_old, btn_new, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
