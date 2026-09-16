import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove --backup-border from inline styles
content = content.replace("'--backup-border': 'var(--backdrop)',", "/* removed --backup-border */")

# Add --backup-border to base CSS
base_css = """
    [data-glow] {
      --backup-border: var(--backdrop);
      transition: --backup-border 0.3s, box-shadow 0.3s;
    }
    
    [data-glow]::before,
"""

content = content.replace("[data-glow]::before,", base_css, 1)

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
