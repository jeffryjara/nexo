import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix truth table cells
old_get_cell_styles = """            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                const baseStyle = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";
                if (cell === '-') {
                    return baseStyle + "bg-transparent text-white/20 border-white/5 hover:bg-white/5";
                }"""
new_get_cell_styles = """            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                if (cell === '-') {
                    return "w-16 h-14 rounded-xl font-bold text-2xl transition-all bg-transparent text-white/20 hover:bg-white/5";
                }
                const baseStyle = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";"""
content = content.replace(old_get_cell_styles, new_get_cell_styles)


# Fix Karnaugh map cells
old_kmap_styles = """                                                                        let style = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";
                                                                        if (cell === '-') style += "bg-transparent text-white/20 border-transparent hover:bg-white/5";
                                                                        else if (cell === correctValue) style += "bg-transparent text-white border-green-500";
                                                                        else style += "bg-transparent text-white border-red-500";"""
new_kmap_styles = """                                                                        let style = "w-16 h-14 rounded-xl font-bold text-2xl transition-all ";
                                                                        if (cell === '-') style += "bg-transparent text-white/20 hover:bg-white/5";
                                                                        else if (cell === correctValue) style += "shadow-sm border bg-transparent text-white border-green-500";
                                                                        else style += "shadow-sm border bg-transparent text-white border-red-500";"""
content = content.replace(old_kmap_styles, new_kmap_styles)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
