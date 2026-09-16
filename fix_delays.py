import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove animation delays
content = re.sub(r' style="animation-delay: 0\.\ds"', '', content)

# Remove animate-fade-in to prevent the entire card from vanishing and reappearing
# (It might be causing the "white screen" / flash effect)
# We will keep animate-fade-in on the header but remove it from the grid items to ensure instant load
content = content.replace(' animate-fade-in group', ' group')

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
