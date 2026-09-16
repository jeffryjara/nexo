import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert table grid lines
content = content.replace('border border-transparent', 'border border-border')
content = content.replace('border-b border-transparent', 'border-b border-border')
content = content.replace('border-r border-transparent', 'border-r border-border')

# But we need to make sure the BUTTON borders remain transparent.
# In the button styles, it was:
# "border border-transparent outline-none shadow-none bg-transparent text-white/20 hover:bg-white/5"
# Because I just replaced "border border-transparent" with "border border-border", I broke the buttons!
content = content.replace('border border-border outline-none shadow-none', 'border border-transparent outline-none shadow-none')
content = content.replace('border border-border shadow-none', 'border border-transparent shadow-none')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
