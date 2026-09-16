import re
with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("const renderKMap = () => {")
end = content.find("};", start) + 2
if start == -1:
    print("renderKMap not found")
else:
    print(content[start:end])
