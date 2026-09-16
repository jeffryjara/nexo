import re

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the main header title a gradient
title_old = '<h1 className="text-3xl font-extrabold text-text-main tracking-tight">Arquitectura del Computador</h1>'
title_new = '<h1 className="text-3xl font-extrabold bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent tracking-tight">Arquitectura del Computador</h1>'
content = content.replace(title_old, title_new)

# Update the Problem title to have a subtle gradient
prob_title_old = '<h2 className="text-xl font-bold text-text-main mb-4 pl-2">{currentProblem.title}</h2>'
prob_title_new = '<h2 className="text-xl font-extrabold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-4 pl-2">{currentProblem.title}</h2>'
content = content.replace(prob_title_old, prob_title_new)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

