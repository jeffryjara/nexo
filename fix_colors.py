import os
import re

directories = ['src/pages', 'src/components']

replacements = {
    'white/5': '[rgba(255,255,255,0.05)]',
    'white/10': '[rgba(255,255,255,0.1)]',
    'white/15': '[rgba(255,255,255,0.15)]',
    'white/20': '[rgba(255,255,255,0.2)]',
    'white/30': '[rgba(255,255,255,0.3)]',
    'white/50': '[rgba(255,255,255,0.5)]',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        # Replace occurrences like bg-white/5, border-white/5, text-white/5
        new_content = re.sub(rf'(bg|border|text|ring|shadow)-{old}\b', rf'\1-{new}', new_content)
        # also hover:bg-white/5 -> hover:bg-[rgba(...)]
        new_content = re.sub(rf'hover:(bg|border|text|ring|shadow)-{old}\b', rf'hover:\1-{new}', new_content)
        # also focus:ring-white/20 etc
        new_content = re.sub(rf'focus:(bg|border|text|ring|shadow)-{old}\b', rf'focus:\1-{new}', new_content)
        # also group-hover:
        new_content = re.sub(rf'group-hover:(bg|border|text|ring|shadow)-{old}\b', rf'group-hover:\1-{new}', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.astro', '.jsx')):
            process_file(os.path.join(root, file))

