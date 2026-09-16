import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the description under 1. Tabla de Verdad
desc_regex = r'<p className="text-sm text-text-muted mb-6 font-medium">Configura manualmente los valores \(0 o 1\)\. Asegúrate de incluir todas las combinaciones posibles\.</p>'
content = re.sub(desc_regex, '', content)

# 2. Make all titles exactly text-lg to ensure uniform size (maybe text-xl was optically huge)
content = content.replace('<h3 className="text-xl font-bold text-text-main mb-2">1. Tabla de Verdad</h3>', '<h3 className="text-lg font-bold text-text-main mb-4">1. Tabla de Verdad</h3>')
content = content.replace('<h3 className="text-xl font-bold text-text-main mb-4">2. Procedimiento (Álgebra de Boole)</h3>', '<h3 className="text-lg font-bold text-text-main mb-4">2. Procedimiento (Álgebra de Boole)</h3>')
content = content.replace('<h3 className="text-xl font-bold text-text-main mb-4">3. Función Lógica Final</h3>', '<h3 className="text-lg font-bold text-text-main mb-4">3. Función Lógica Final</h3>')

# 3. Update getCellStyles
old_styles = r"""
                if \(cell === correctValue\) \{
                    return baseStyle \+ "bg-green-500/10 text-green-400 border-green-500/50 shadow-\[0_0_15px_rgba\(34,197,94,0\.15\)\] hover:bg-green-500/20";
                \} else \{
                    return baseStyle \+ "bg-red-500/10 text-red-400 border-red-500/50 shadow-\[0_0_15px_rgba\(239,68,68,0\.15\)\] hover:bg-red-500/20";
                \}
"""

new_styles = """
                if (cell === correctValue) {
                    return baseStyle + "bg-transparent text-white border-green-500";
                } else {
                    return baseStyle + "bg-transparent text-white border-red-500";
                }
"""
content = re.sub(old_styles.strip(), new_styles.strip(), content, flags=re.DOTALL)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("UI details updated.")
