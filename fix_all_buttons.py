import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix truth table cells
old_get_cell_styles = """            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                if (cell === '-') {
                    return "w-16 h-14 rounded-xl font-bold text-2xl transition-all bg-transparent text-white/20 hover:bg-white/5";
                }
                const baseStyle = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border ";"""
new_get_cell_styles = """            const getCellStyles = (cell, rIndex, cIndex, isOutputCell) => {
                if (cell === '-') {
                    return "w-16 h-14 rounded-xl font-bold text-2xl transition-all border border-transparent outline-none shadow-none bg-transparent text-white/20 hover:bg-white/5";
                }
                const baseStyle = "w-16 h-14 rounded-xl font-bold text-2xl transition-all shadow-sm border outline-none ";"""
content = content.replace(old_get_cell_styles, new_get_cell_styles)

# Fix Karnaugh map cells
old_kmap_styles = """                                                                        let style = "w-16 h-14 rounded-xl font-bold text-2xl transition-all ";
                                                                        if (cell === '-') style += "bg-transparent text-white/20 hover:bg-white/5";
                                                                        else if (cell === correctValue) style += "shadow-sm border bg-transparent text-white border-green-500";
                                                                        else style += "shadow-sm border bg-transparent text-white border-red-500";"""
new_kmap_styles = """                                                                        let style = "w-16 h-14 rounded-xl font-bold text-2xl transition-all outline-none ";
                                                                        if (cell === '-') style += "border border-transparent shadow-none bg-transparent text-white/20 hover:bg-white/5";
                                                                        else if (cell === correctValue) style += "shadow-sm border bg-transparent text-white border-green-500";
                                                                        else style += "shadow-sm border bg-transparent text-white border-red-500";"""
content = content.replace(old_kmap_styles, new_kmap_styles)

# Also let's completely remove the border-border outer class of the Karnaugh map and Truth Table just in case they meant the table outer border too.
# The table is: table className="w-auto text-center border-collapse bg-surface rounded-2xl overflow-hidden shadow-inner border border-border"
# Let's change border border-border to just border-transparent so it has no outer border, but retains structure.
content = content.replace('border border-border', 'border border-transparent')
content = content.replace('border-b border-border', 'border-b border-transparent')
content = content.replace('border-r border-border', 'border-r border-transparent')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
