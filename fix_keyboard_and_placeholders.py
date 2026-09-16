import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Update Keyboard Keys
keyboard_old = r'''<div className="grid grid-cols-10 gap-2 mb-2">
                                    \{inputs\.map\(v => \(
                                        <button key=\{v\} onClick=\{\(\) => handleKeyboardClick\(v\)\} className="col-span-2 bg-surface hover:bg-accent-soft text-text-main font-black text-2xl py-3 rounded-xl shadow-sm border border-border transition-colors active:scale-95">\{v\}</button>
                                    \)\)\}
                                    <button onClick=\{\(\) => handleKeyboardClick\(output\)\} className="col-span-2 bg-accent/10 hover:bg-accent/20 text-white font-black text-2xl py-3 rounded-xl shadow-sm border border-white/20 transition-colors active:scale-95">\{output\}</button>
                                    \{Array\.from\(\{length: Math\.max\(0, 5 - \(inputs\.length \+ 1\)\)\}\)\.map\(\(_, i\) => \(
                                        <div key=\{'space'\+i\} className="col-span-2"></div>
                                    \)\)\}
                                </div>'''

keyboard_new = r'''<div className="grid grid-cols-10 gap-2 mb-2">
                                    {inputs.map(v => (
                                        <button key={v} onClick={() => handleKeyboardClick(v)} className="col-span-2 bg-surface hover:bg-accent-soft text-text-main font-black text-2xl py-3 rounded-xl shadow-sm border border-border transition-colors active:scale-95">{v}</button>
                                    ))}
                                    {activeInput !== 'final' && (
                                        <button onClick={() => handleKeyboardClick(output)} className="col-span-2 bg-accent/10 hover:bg-accent/20 text-white font-black text-2xl py-3 rounded-xl shadow-sm border border-white/20 transition-colors active:scale-95">{output}</button>
                                    )}
                                    {Array.from({length: Math.max(0, 5 - (inputs.length + (activeInput === 'final' ? 0 : 1)))}).map((_, i) => (
                                        <div key={'space'+i} className="col-span-2"></div>
                                    ))}
                                </div>'''

nexo = re.sub(keyboard_old, keyboard_new, nexo)

# 2. Update Fake Placeholder
fake_old = r'<div className="absolute top-5 left-5 pointer-events-none text-text-muted/50 text-2xl font-mono font-bold">'
fake_new = r'<div className="absolute top-5 left-5 pointer-events-none opacity-40 text-white text-2xl font-mono font-bold">'
nexo = re.sub(fake_old, fake_new, nexo)

# 3. Update Final Function Native Placeholder Styling
input_old = r'className="flex-1 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none text-2xl text-text-main font-mono font-bold transition-all"'
input_new = r'className="flex-1 p-5 rounded-2xl border border-border bg-surface dark:border-white/10 focus:glass-panel focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none text-2xl text-text-main placeholder-white/40 font-mono font-bold transition-all"'
nexo = re.sub(input_old, input_new, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
