import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the header in LogicLab
header_old = r'<h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>'
header_new = """
                                    <div className="flex items-center gap-4">
                                        <a href="/" className="text-text-muted hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5" title="Volver a Mis Cursos">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                                        </a>
                                        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>
                                    </div>
"""

content = re.sub(header_old, header_new.strip(), content)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
