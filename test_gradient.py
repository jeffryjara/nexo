import re

with open('src/components/ui/InteractiveHoverButton.jsx', 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

export const InteractiveHoverButton = React.forwardRef(({ text = "Button", className, onClick, ...props }, ref) => {
  return (
    <>
      <style>{`
        @keyframes snake-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <button
        ref={ref}
        onClick={onClick}
        className={`group relative w-full sm:w-auto min-w-[220px] cursor-pointer overflow-hidden rounded-2xl p-[2px] text-center font-bold text-text-main transition-all active:scale-95 shadow-lg ${className || ""}`}
        {...props}
      >
        {/* Snake Border Gradient */}
        <div 
            className="absolute inset-[-100%] z-0" 
            style={{ 
                animation: 'snake-border 3s linear infinite', 
                backgroundImage: 'conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 85%, #a855f7 100%)' 
            }}
        ></div>
        
        {/* Inner Container */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[14px] bg-surface px-8 py-5">
            {/* Expanding Background on Hover */}
            <div className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-all duration-500 ease-out group-hover:h-[500px] group-hover:w-[500px] z-0"></div>

            {/* Normal Text */}
            <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-lg relative z-10">
              {text}
            </span>

            {/* Hover Content */}
            <div className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-3 text-white opacity-0 transition-all duration-300 group-hover:!translate-x-0 group-hover:opacity-100">
              <svg className="flex-shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span className="text-lg whitespace-nowrap">{text}</span>
            </div>
        </div>
      </button>
    </>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
''')
