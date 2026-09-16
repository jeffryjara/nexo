import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make buttons smaller on mobile
# Replace w-16 h-14 with w-12 h-12 md:w-16 md:h-14
content = content.replace('w-16 h-14', 'w-12 h-12 sm:w-16 sm:h-14 text-xl sm:text-2xl')
content = content.replace('font-bold text-2xl', 'font-bold') # Because I added text-xl sm:text-2xl
content = content.replace('py-3 px-8', 'py-2 px-4 sm:py-3 sm:px-8')
content = content.replace('p-3', 'p-1 sm:p-3')

# Also fix the inner border issue for Firefox by explicitly adding style={{border: 'none', boxShadow: 'none'}} to empty buttons.
# Wait, I can't inject `style` easily using simple regex if it's already JSX.
# But I can add !border-none !shadow-none !ring-0
content = content.replace('border border-transparent outline-none shadow-none bg-transparent', 'border-0 border-transparent !outline-none !shadow-none bg-transparent')
content = content.replace('border border-transparent shadow-none bg-transparent', 'border-0 border-transparent !outline-none !shadow-none bg-transparent')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
