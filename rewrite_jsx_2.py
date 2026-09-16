with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Hints and Warnings
content = content.replace("bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-400 dark:bg-amber-900/40 dark:hover:bg-amber-800/50 dark:text-amber-300 dark:border-amber-700 active:scale-95", "bg-warning-soft text-warning border-warning/30 hover:border-warning/50 active:scale-95")
content = content.replace("bg-amber-100 text-amber-800 font-bold py-3 px-6 rounded-xl border border-amber-400 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700", "bg-warning-soft text-warning border-warning/30 font-bold py-3 px-6 rounded-xl border")
content = content.replace("text-amber-700 dark:text-amber-500", "text-warning")

# Bad cards and tables
content = content.replace("bg-white dark:bg-darkcard/70 dark:backdrop-blur-2xl rounded-3xl p-8 shadow-lg border border-border", "glass-panel rounded-3xl p-8 shadow-lg")
content = content.replace("bg-white dark:bg-darkcard/70 dark:backdrop-blur-2xl", "glass-panel")
content = content.replace("text-slate-500 dark:text-gray-400", "text-text-muted")
content = content.replace("text-slate-800 dark:text-gray-200", "text-text-main")
content = content.replace("hover:bg-slate-100 dark:hover:bg-[#111]/50", "hover:bg-accent-soft")
content = content.replace("hover:bg-slate-100 dark:hover:bg-[#111]", "hover:bg-accent-soft")
content = content.replace("bg-surface text-slate-700 dark:text-gray-300", "bg-surface text-text-muted")
content = content.replace("bg-slate-700 text-slate-500 border-border cursor-not-allowed", "bg-surface text-text-muted border-border cursor-not-allowed opacity-50")
content = content.replace("text-slate-700 dark:text-gray-300", "text-text-muted")

# Form inputs
content = content.replace("focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-900/50", "focus:border-accent focus:ring-4 focus:ring-accent/20")

# Error panels
content = content.replace("bg-red-50 border-2 border-red-400 dark:bg-red-900/20 dark:border-red-400 dark:border-red-800/50", "bg-error-soft border-2 border-error/50")
content = content.replace("border-red-400 dark:border-red-800/50", "border-error/50")

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

