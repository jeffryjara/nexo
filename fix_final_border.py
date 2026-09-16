import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

old_str = '''<div className="glass-panel rounded-none p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="flex items-center justify-center mb-6">
                                    <h3 className="text-2xl font-bold text-text-main text-center flex items-center">Función Lógica Final {renderClearBtn(handleClearFinal)}</h3>'''

new_str = '''<div className="glass-panel rounded-b-3xl rounded-t-none p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
                                <div className="flex items-center justify-center mb-6">
                                    <h3 className="text-2xl font-bold text-text-main text-center flex items-center">Función Lógica Final {renderClearBtn(handleClearFinal)}</h3>'''

nexo = nexo.replace(old_str, new_str)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
