import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Add custom modal state
state_code = "const [clearTarget, setClearTarget] = useState(null);"
nexo = nexo.replace('const [showRules, setShowRules] = useState(false);', 'const [showRules, setShowRules] = useState(false);\n    const [clearTarget, setClearTarget] = useState(null);')

# 2. Modify the handlers to trigger the modal instead of window.confirm
# Wait, let's just replace the handleClear... definitions.
old_handlers = r'''const handleClearTables = \(\) => {
            if \(window\.confirm\("¿Estás seguro de limpiar las tablas\?"\)\) {
                resetGrid\(currentProblem\);
            }
        };
        const handleClearKMap = \(\) => {
            if \(window\.confirm\("¿Estás seguro de limpiar el Mapa de Karnaugh\?"\)\) {
                setKmapValues\(\{\}\);
            }
        };
        const handleClearProcedimiento = \(\) => {
            if \(window\.confirm\("¿Estás seguro de limpiar el Procedimiento\?"\)\) {
                setUserSteps\(''\);
            }
        };
        const handleClearFinal = \(\) => {
            if \(window\.confirm\("¿Estás seguro de limpiar la Función Lógica Final\?"\)\) {
                setUserFinal\(''\);
            }
        };'''

new_handlers = '''const handleClearTables = () => setClearTarget('tables');
        const handleClearKMap = () => setClearTarget('kmap');
        const handleClearProcedimiento = () => setClearTarget('procedimiento');
        const handleClearFinal = () => setClearTarget('final');

        const executeClear = () => {
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
        };'''
nexo = re.sub(old_handlers, new_handlers, nexo)

# 3. Add the Modal HTML just before showRules block
modal_html = """
            {clearTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setClearTarget(null)}></div>
                    <div className="relative group rounded-3xl overflow-hidden max-w-md w-full flex flex-col border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] bg-[#a855f7]/10 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
                        <InductionCardEffect className="absolute inset-0 z-0 pointer-events-none" />
                        <div className="relative z-10 p-8">
                            <button onClick={() => setClearTarget(null)} className="absolute top-6 right-6 text-text-muted hover:text-white transition">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-warning-soft flex items-center justify-center text-2xl shadow-sm border border-warning-soft">⚠️</div>
                                <h2 className="text-2xl font-extrabold text-text-main">¿Estás seguro?</h2>
                            </div>
                            <p className="text-text-muted text-base mb-8 leading-relaxed font-medium">
                                {clearTarget === 'tables' && "Esto borrará todos los datos ingresados en la Tabla de Verdad y el Mapa de Karnaugh."}
                                {clearTarget === 'kmap' && "Esto borrará todos los datos ingresados en el Mapa de Karnaugh."}
                                {clearTarget === 'procedimiento' && "Esto borrará todo el texto ingresado en tu Procedimiento."}
                                {clearTarget === 'final' && "Esto borrará tu Función Lógica Final ingresada."}
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setClearTarget(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-text-main bg-surface border border-white/10 hover:bg-white/5 transition">Cancelar</button>
                                <button onClick={executeClear} className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-error hover:bg-error/90 border border-error transition">Sí, limpiar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
"""
nexo = nexo.replace('{/* MODAL DE REGLAS */}', modal_html + '\n            {/* MODAL DE REGLAS */}', 1)

# Wait, `{/* MODAL DE REGLAS */}` was removed in a previous step?
# Let's check where to inject the modal.
# A safe place is just before `{showRules && (`
nexo = nexo.replace('            {showRules && (', modal_html + '\n            {showRules && (', 1)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
