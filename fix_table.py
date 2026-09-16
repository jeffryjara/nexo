import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<table className="([^"]*)border border-transparent([^"]*)"', r'<table className="\1border border-border\2"', content)
content = re.sub(r'border-b border-transparent', 'border-b border-border', content)
content = re.sub(r'border-r border-transparent', 'border-r border-border', content)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
