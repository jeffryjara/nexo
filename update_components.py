import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# 1. Title
nexo = nexo.replace("'Procedimiento' : 'Final'", "'Procedimiento' : 'Función'")

# 2. Enter button
nexo = nexo.replace(">Enter ↵</button>", ">Enter</button>")

# 3. Backspace button
bs_old = r'<button onClick=\{\(\) => handleKeyboardClick\(\'Backspace\'\)\} className="col-span-2 bg-warning hover:bg-warning/90 text-text-main font-bold text-xl py-3 rounded-xl shadow-sm border border-warning active:scale-95 flex items-center justify-center">⌫</button>'
bs_new = r'<button onClick={() => handleKeyboardClick(\'Backspace\')} className="col-span-2 bg-error hover:bg-error/90 text-text-main font-bold text-xl py-3 rounded-xl shadow-sm border border-error active:scale-95 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" x2="12" y1="9" y2="15"/><line x1="12" x2="18" y1="9" y2="15"/></svg></button>'
nexo = re.sub(bs_old, bs_new, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)

# 4. Update InteractiveHoverButton
hover_btn = '''import React from "react";

export const InteractiveHoverButton = React.forwardRef(({ text = "Button", className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative w-full sm:w-auto min-w-[200px] cursor-pointer overflow-hidden rounded-2xl border border-accent bg-surface py-5 px-10 text-center font-bold text-text-main transition-all active:scale-95 shadow-lg ${className || ""}`}
      {...props}
    >
      <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-lg relative z-10">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-3 text-white opacity-0 transition-all duration-300 group-hover:!translate-x-0 group-hover:opacity-100">
        <svg className="flex-shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <span className="text-lg whitespace-nowrap">{text}</span>
      </div>
      <div className="absolute left-[15%] top-[45%] h-2 w-2 scale-[1] rounded-lg bg-accent transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-accent group-hover:rounded-2xl"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
'''
with open('src/components/ui/InteractiveHoverButton.jsx', 'w', encoding='utf-8') as f:
    f.write(hover_btn)

