import os
import re

files_to_fix = [
    'src/pages/index.astro',
    'src/components/LogicLab.jsx'
]

for filepath in files_to_fix:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix border opacity modifiers that use CSS variables
    content = content.replace('border-accent/30', 'border-accent-soft')
    content = content.replace('border-warning/30', 'border-warning-soft')
    content = content.replace('border-warning/50', 'border-warning')
    content = content.replace('border-success/50', 'border-success-soft')
    content = content.replace('border-error/50', 'border-error-soft')
    content = content.replace('shadow-green-900/50', 'shadow-success-soft')
    content = content.replace('shadow-accent/20', 'shadow-accent-soft')
    content = content.replace('border-indigo-900/50', 'border-accent-soft')
    content = content.replace('bg-indigo-900/30', 'bg-accent-soft')
    content = content.replace('bg-indigo-900/10', 'bg-accent-soft')

    # Also the user specifically mentioned Image 3 (Karnaugh map empty cells).
    # "border-white/5" is valid but maybe it looks bad. Let's remove the border for '-' cells.
    # In LogicLab.jsx:
    if 'LogicLab.jsx' in filepath:
        old_kmap_cell = "if (cell === '-') style += \"bg-transparent text-white/20 border-white/5 hover:bg-white/5\";"
        new_kmap_cell = "if (cell === '-') style += \"bg-transparent text-white/20 border-transparent hover:bg-white/5\";"
        content = content.replace(old_kmap_cell, new_kmap_cell)
        
        # Also remove the border from the T, P, S table if it's too much.
        # But wait, Karnaugh map header T P S doesn't have borders on the image? 
        # Actually it does, and maybe they want them gone.
        # "border-border" is fine, but maybe let's remove the solid outer border of the Kmap?
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Borders fixed!")
