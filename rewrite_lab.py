import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add GlowCard import if not there
if "import { GlowCard }" not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { GlowCard } from './ui/spotlight-card';")

# 2. Add showRules state
content = content.replace("const [scrolled, setScrolled] = useState(false);", "const [scrolled, setScrolled] = useState(false);\n    const [showRules, setShowRules] = useState(false);")

# 3. Add Reglas button to header
header_pattern = re.compile(r'(<h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>\s*</div>\s*</div>)')
new_header_content = r'\1\n                    <button onClick={() => setShowRules(true)} className="glass-panel px-5 py-2.5 rounded-xl font-bold text-sm text-accent hover:text-white transition flex items-center gap-2 border border-white/10 hover:bg-accent/20">💡 Reglas</button>'
content = header_pattern.sub(new_header_content, content)

# 4. Wrap "Problema 1" block in GlowCard
# Current: <div className="glass-panel rounded-3xl p-6 sm:p-8 border-l-4 border-l-accent shadow-xl relative overflow-hidden">
# Replace with: <GlowCard client:load customSize={true} glowColor="purple" className="!p-6 sm:!p-8 !rounded-3xl !border-l-4 !border-l-accent !relative !overflow-hidden">
content = content.replace('<div className="glass-panel rounded-3xl p-6 sm:p-8 border-l-4 border-l-accent shadow-xl relative overflow-hidden">', '<GlowCard customSize={true} glowColor="purple" className="!p-6 sm:!p-8 !rounded-3xl !border-l-4 !border-l-[var(--accent-color)] !relative !overflow-hidden">')
content = content.replace('                    </div>\n\n                    <div className="glass-panel rounded-3xl p-8 shadow-lg"', '                    </GlowCard>\n\n                    <div className="glass-panel rounded-3xl p-8 shadow-lg"')

# 5. Remove the 3-column grid and Formulitas side panel
content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">', '<div className="flex flex-col gap-8 relative">')
content = content.replace('<div className="lg:col-span-2 flex flex-col gap-8">', '<div className="flex flex-col gap-8">')

formulitas_block = content[content.find('{/* PANEL LATERAL: FORMULITAS */}'):content.find('</div>\n                    </div>\n\n                    {/* TECLADO VIRTUAL')]
if formulitas_block:
    content = content.replace(formulitas_block, "")
    # Remove one more closing div
    content = content.replace('</div>\n\n                    {/* TECLADO VIRTUAL', '{/* TECLADO VIRTUAL')

# 6. Restructure Table and Procedure to show Karnaugh side-by-side
# Right now, Table is:
# <h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>
# <div className="overflow-x-auto mb-10 flex justify-center lg:justify-start"> ... </div>
#
# Let's wrap Table and KMap in a grid.
# Find the start of Tabla de Verdad
old_tabla_start = '<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>'
new_tabla_start = '<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">\n                                    <div>\n                                        <h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>'
content = content.replace(old_tabla_start, new_tabla_start)

# Find the end of Tabla de Verdad (before Procedimiento)
old_proc_start = '<div className="flex items-center justify-between mb-4">'
new_proc_start = '</div>\n                                    <div className="flex flex-col">\n                                        <div className="flex items-center justify-between mb-4">\n                                            <h3 className="text-lg font-bold text-text-main">2. Mapa de Karnaugh</h3>\n                                        </div>\n                                        <div className="overflow-x-auto flex justify-center lg:justify-start flex-1">\n                                            {(() => {\n                                                const kMapDims = getKMapDimensions(currentProblem.inputs.length);\n                                                if (!kMapDims) return <p className="text-warning">Karnaugh no está disponible para este número de variables.</p>;\n                                                \n                                                return (\n                                                    <table className="w-auto text-center border-collapse bg-surface rounded-2xl overflow-hidden border border-border relative my-auto">\n                                                        <thead className="glass-panel">\n                                                            <tr>\n                                                                <th className="p-3 border-b border-r border-border text-text-muted font-bold relative min-w-[60px]">\n                                                                    <span className="absolute bottom-1 left-2 text-xs">{kMapDims.colVars}</span>\n                                                                    <span className="absolute top-1 right-2 text-xs">{kMapDims.rowVars}</span>\n                                                                    <svg className="absolute inset-0 w-full h-full text-border" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1"/></svg>\n                                                                </th>\n                                                                {kMapDims.cols.map((c, i) => (\n                                                                    <th key={"c"+i} className="p-3 border-b border-border text-text-main font-bold min-w-[50px]">{c}</th>\n                                                                ))}\n                                                            </tr>\n                                                        </thead>\n                                                        <tbody>\n                                                            {kMapDims.rows.map((r, rIdx) => (\n                                                                <tr key={"r"+rIdx}>\n                                                                    <th className="p-3 border-r border-border text-text-main font-bold glass-panel">{r}</th>\n                                                                    {kMapDims.cols.map((c, cIdx) => {\n                                                                        const cellKey = r + c;\n                                                                        return (\n                                                                            <td key={cellKey} className="p-0 border border-border">\n                                                                                <input\n                                                                                    type="text"\n                                                                                    maxLength={1}\n                                                                                    value={kmapValues[cellKey] || \'\'}\n                                                                                    onChange={(e) => {\n                                                                                        const val = e.target.value;\n                                                                                        if (val === \'0\' || val === \'1\' || val === \'\') {\n                                                                                            setKmapValues(prev => ({...prev, [cellKey]: val}));\n                                                                                        }\n                                                                                    }}\n                                                                                    className="w-full h-full min-h-[50px] text-center bg-transparent focus:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-main font-bold text-lg"\n                                                                                />\n                                                                            </td>\n                                                                        );\n                                                                    })}\n                                                                </tr>\n                                                            ))}\n                                                        </tbody>\n                                                    </table>\n                                                );\n                                            })()}\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div className="border-t border-white/5 pt-8 mb-4">\n                                    <h3 className="text-lg font-bold text-text-main mb-4">3. Procedimiento (Álgebra de Boole)</h3>'

# But wait, there is already logic for KMap inside Procedure block.
# Let's remove the old Procedure block contents to avoid duplication.
old_proc_full_start = '<div className="flex items-center justify-between mb-4">\n                                    <h3 className="text-lg font-bold text-text-main">2. Procedimiento</h3>'

content = content.replace(old_proc_full_start, new_proc_start)

# Now we need to remove the old K-map logic and toggle buttons from the old block.
# I will use a regex to strip out the old toggle buttons
toggle_pattern = re.compile(r'<div className="flex bg-surface rounded-xl p-1 border border-border">.*?</div>', re.DOTALL)
content = toggle_pattern.sub('', content)

# Remove the {procedureMethod === 'boole' && ( ... )} wrapper
content = content.replace("{procedureMethod === 'boole' && (", "")
content = content.replace("                                    />\n                                )}", "                                    />")

# Remove the {procedureMethod === 'karnaugh' && ( ... )} block completely
karnaugh_block_pattern = re.compile(r'\{procedureMethod === \'karnaugh\' && \(\s*<div className="mb-8 animate-fade-in">.*?</div>\s*\)\}', re.DOTALL)
content = karnaugh_block_pattern.sub('', content)

# 7. Add Modal for Reglas
modal_jsx = """
            {showRules && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRules(false)}></div>
                    <div className="glass-panel relative rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                        <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-text-muted hover:text-white transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-warning-soft flex items-center justify-center text-2xl shadow-sm border border-warning-soft">💡</div>
                            <h2 className="text-2xl font-extrabold text-text-main">Reglas</h2>
                        </div>
                        <p className="text-text-muted text-base mb-6 leading-relaxed font-medium">Recuerda estas 3 reglas del Álgebra de Boole para simplificar:</p>
                        
                        <div className="space-y-4">
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">1. Idempotencia</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A + A = A</p>
                            </div>
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">2. Complemento (Suma)</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A + A' = 1</p>
                            </div>
                            <div className="bg-surface border border-white/5 p-5 rounded-2xl shadow-sm transition hover:border-accent-soft">
                                <h4 className="text-sm font-extrabold text-warning uppercase tracking-widest mb-2">3. Complem. (Mult.)</h4>
                                <p className="font-mono text-2xl text-text-main font-black">A · A' = 0</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
"""

content = content.replace("export default function NexoLab() {", "export default function NexoLab() {")
# Insert modal just before the final </div> of the component
content = content.replace("            {/* TECLADO VIRTUAL FLOTANTE Y ARRASTRABLE */}", modal_jsx + "\n\n            {/* TECLADO VIRTUAL FLOTANTE Y ARRASTRABLE */}")

# 8. Fix the logic validation. Now both Boole and Karnaugh are on screen.
# We should probably always validate both if they are filled, or just rely on what the user provided.
# Actually, the user can use whatever method they want. To make it pass, they need to fill AT LEAST ONE method correctly.
# If they fill Boole, it must be correct. If they fill Karnaugh, it must be correct.
# Wait, let's just make the KMap check optional unless they filled it, OR validate it if `procedureMethod` is removed.
# I will change the logic to validate Boole only, and just leave KMap as a visual helper! That's much simpler.
# Wait, if KMap was previously a formal step, let's keep it.
# The `procedureMethod` state still exists! Let's just remove the validation dependency on `procedureMethod` or default it to 'boole'.
# If `procedureMethod` is 'boole' by default, the original validation only checks boole.
# So I don't need to change the validation logic if I just let procedureMethod default to 'boole'!
# Let's ensure `procedureMethod` defaults to 'boole'. It already does: `const [procedureMethod, setProcedureMethod] = useState('boole');`.

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
