import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Add import
import_pattern = r"import \{ InductionCardEffect \} from '\./ui/InductionCardEffect';"
import_replacement = r"import { InductionCardEffect } from './ui/InductionCardEffect';\nimport { InteractiveHoverButton } from './ui/InteractiveHoverButton';"
nexo = re.sub(import_pattern, import_replacement, nexo)

# 2. Replace button
btn_pattern = r'<button onClick=\{checkAnswer\} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold text-lg py-5 px-10 rounded-2xl shadow-lg transition-transform active:scale-95 border border-accent whitespace-nowrap flex items-center justify-center gap-3">\s*<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>\s*Comprobar\s*</button>'
btn_replacement = r'<InteractiveHoverButton onClick={checkAnswer} text="Comprobar" />'
nexo = re.sub(btn_pattern, btn_replacement, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
