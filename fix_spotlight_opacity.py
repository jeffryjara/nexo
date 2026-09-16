import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a state to track if mouse has moved
state_import = "import React, { useEffect, useRef, useState } from 'react';\nimport type { ReactNode } from 'react';"
content = content.replace("import React, { useEffect, useRef } from 'react';\nimport type { ReactNode } from 'react';", state_import)

# Inside GlowCard, add state
state_declaration = """  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);"""
content = content.replace("  const cardRef = useRef<HTMLDivElement>(null);\n  const innerRef = useRef<HTMLDivElement>(null);", state_declaration)

# Update syncPointer to set isHovering
new_sync = """    const syncPointer = (e: PointerEvent) => {
      if (!isHovering) setIsHovering(true);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      }
    };"""
content = re.sub(r'    const syncPointer =.*?};', new_sync, content, flags=re.DOTALL)

# Modify getInlineStyles to use isHovering
style_replacement = """    const baseStyles: React.CSSProperties = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(0 0% 60% / 0.12)',
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      '--bg-spot-opacity': isHovering ? '0.15' : '0',
      '--border-spot-opacity': isHovering ? '1' : '0',
      '--border-light-opacity': isHovering ? '1' : '0',"""
content = re.sub(r"    const baseStyles = \{.*?'--border-size': 'calc\(var\(--border, 2\) \* 1px\)',.*?\} / var\(--bg-spot-opacity, 0\.1\)\), transparent\n      \`,", 
    style_replacement + """\n      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`, """, content, flags=re.DOTALL)

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
