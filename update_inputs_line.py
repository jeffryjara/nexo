with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'placeholder="Ej:\\nS = ' in line:
        # We need to replace the entire textarea block
        # The textarea spans from line i-4 to i+1
        lines[i-4] = '<div className="relative w-full">\n{!userSteps && (\n<div className="absolute top-5 left-5 pointer-events-none text-text-muted/60 text-lg font-mono leading-relaxed">\nEj: <br/>\n<span className="text-accent font-bold">{output}</span> = A\'B + B\'C + C\'A\n</div>\n)}\n<textarea \n'
        lines[i-3] = 'value={userSteps}\n'
        lines[i-2] = 'onChange={(e) => setUserSteps(e.target.value)}\n'
        lines[i-1] = 'onFocus={() => { setActiveInput(\'steps\'); setIsKeyboardOpen(true); }}\n'
        lines[i] = 'className="w-full h-52 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none resize-none text-text-main font-mono text-lg leading-relaxed transition-all"\n'
        lines[i+1] = '/>\n</div>\n'
        
    if 'Comprobar Solución' in line:
        lines[i-1] = '<button onClick={handleVerify} className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-white bg-accent hover:bg-accent/90 border border-accent hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-3 min-w-[200px]">\n'
        lines[i] = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>\nComprobar\n'

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
