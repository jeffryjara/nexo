import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add hover effect
hover_css = """
    .group:hover > [data-glow] {
      --backup-border: var(--accent-color) !important;
      box-shadow: 0 0 30px rgba(67,56,202,0.3) !important;
    }
  `;"""

content = content.replace("  `;", hover_css)

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
