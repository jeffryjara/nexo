with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert state changes
content = content.replace("import React, { useEffect, useRef, useState } from 'react';", "import React, { useEffect, useRef } from 'react';")
content = content.replace("const [isHovering, setIsHovering] = useState(false);", "")
content = content.replace("if (!isHovering) setIsHovering(true);", "")

# In syncPointer, add the opacity setters
sync_ptr = """        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
        cardRef.current.style.setProperty('--bg-spot-opacity', '0.15');
        cardRef.current.style.setProperty('--border-spot-opacity', '1');
        cardRef.current.style.setProperty('--border-light-opacity', '1');"""

content = content.replace("""        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));""", sync_ptr)

# In getInlineStyles, clean up the previous failed replacements
content = content.replace("'--bg-spot-opacity': isHovering ? '0.1' : '0',", "")
content = content.replace("'--border-spot-opacity': isHovering ? '1' : '0',", "")
content = content.replace("'--border-light-opacity': isHovering ? '1' : '0',", "")

# Set default opacities to 0
defaults = """      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      '--bg-spot-opacity': '0',
      '--border-spot-opacity': '0',
      '--border-light-opacity': '0',"""
content = content.replace("'--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',", defaults)

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
