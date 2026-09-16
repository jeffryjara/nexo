with open('src/data/problems.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find "title: "Problema 6:" and insert the missing `{` before it.
content = content.replace('\n        title: "Problema 6: Robot seguidor de línea",', '\n    {\n        title: "Problema 6: Robot seguidor de línea",')

with open('src/data/problems.js', 'w', encoding='utf-8') as f:
    f.write(content)
