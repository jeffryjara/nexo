import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add AgentQL-style grid background
# We can use a linear-gradient trick to create a very subtle grid.
grid_css = """
body {
  background-color: var(--bg-color);
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
    var(--bg-gradient);
  background-size: 32px 32px, 32px 32px, cover;
  background-position: center top;
"""

content = re.sub(r'body\s*\{\s*background-color:\s*var\(--bg-color\);\s*background-image:\s*var\(--bg-gradient\);', grid_css.strip(), content)

# AgentQL gradients are often slightly violet/blue
gradient_old = r'--bg-gradient:\s*radial-gradient\(100%\s*100%\s*at\s*50%\s*0%,\s*rgba\(67,\s*56,\s*202,\s*0\.15\)\s*0%,\s*rgba\(0,\s*0,\s*0,\s*0\)\s*50%\);'
gradient_new = '--bg-gradient: radial-gradient(120% 100% at 50% -10%, rgba(120, 119, 198, 0.15) 0%, rgba(0, 0, 0, 0) 40%);'
content = re.sub(r'--bg-gradient: radial-gradient\(100% 100% at 50% 0%, #4338ca26 0%, #0000 50%\)', gradient_new, content)
content = re.sub(r'--bg-gradient: radial-gradient\(100% 100% at 50% 0%, rgba\(67, 56, 202, 0.15\) 0%, rgba\(0, 0, 0, 0\) 50%\);', gradient_new, content)

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("CSS updated for AgentQL style.")
