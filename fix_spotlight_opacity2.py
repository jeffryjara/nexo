import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getInlineStyles explicitly
content = content.replace(
    "'--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',",
    "'--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',\n      '--bg-spot-opacity': isHovering ? '0.1' : '0',\n      '--border-spot-opacity': isHovering ? '1' : '0',\n      '--border-light-opacity': isHovering ? '1' : '0',"
)

# And in useEffect, we need to add isHovering to dependency array so it updates, or just use CSS classes
