import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the IHC link and add lg:row-span-2 to its classes
ihc_pattern = r'(<a href="/ihc" class=")(glass-panel p-8 rounded-3xl)'
replacement = r'\1lg:row-span-2 \2'

new_content = re.sub(ihc_pattern, replacement, content)

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(new_content)
