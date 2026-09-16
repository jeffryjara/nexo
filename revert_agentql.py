import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Revert grid background
grid_old = r"""body\s*\{\s*background-color:\s*var\(--bg-color\);\s*background-image:\s*linear-gradient\(to right, rgba\(255,255,255,0\.02\) 1px, transparent 1px\),\s*linear-gradient\(to bottom, rgba\(255,255,255,0\.02\) 1px, transparent 1px\),\s*var\(--bg-gradient\);\s*background-size:\s*32px 32px, 32px 32px, cover;\s*background-position:\s*center top;"""
grid_new = """body {\n  background-color: var(--bg-color);\n  background-image: var(--bg-gradient);"""
css_content = re.sub(grid_old, grid_new, css_content, flags=re.DOTALL)

# Revert gradient to subtle white/indigo
grad_old = r'--bg-gradient:\s*radial-gradient\(120%\s*100%\s*at\s*50%\s*-10%,\s*rgba\(120,\s*119,\s*198,\s*0\.15\)\s*0%,\s*rgba\(0,\s*0,\s*0,\s*0\)\s*40%\);'
grad_new = '--bg-gradient: radial-gradient(100% 100% at 50% 0%, rgba(67, 56, 202, 0.15) 0%, rgba(0, 0, 0, 0) 50%);'
css_content = re.sub(grad_old, grad_new, css_content)

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    jsx = f.read()

# Revert Comprobar Solucion button
btn_old = r'className="bg-white hover:bg-gray-200 text-black font-extrabold text-lg py-4 px-10 rounded-2xl shadow-\[0_0_30px_rgba\(255,255,255,0\.15\)\] transition-all active:scale-95 border border-transparent"'
btn_new = 'className="bg-accent hover:bg-accent/90 text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent"'
jsx = re.sub(btn_old, btn_new, jsx)

# Fix title color if needed, I already removed bg-clip-text in previous step, let's make sure it's text-text-main
jsx = jsx.replace('className="text-3xl font-extrabold text-white tracking-tight"', 'className="text-3xl font-extrabold text-text-main tracking-tight"')
jsx = jsx.replace('className="text-xl font-extrabold text-white mb-4 pl-2"', 'className="text-xl font-bold text-text-main mb-4 pl-2"')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx)

print("UI reverted to Linear style while keeping sticky header.")
