import React from "react";

export const InteractiveHoverButton = React.forwardRef(({ text = "Button", className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative w-full sm:w-auto min-w-[200px] cursor-pointer overflow-hidden rounded-2xl border border-accent bg-surface py-5 px-10 text-center font-bold text-text-main transition-all active:scale-95 shadow-lg ${className || ""}`}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-lg">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-3 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <span className="text-lg">{text}</span>
      </div>
      <div className="absolute left-[15%] top-[45%] h-2 w-2 scale-[1] rounded-lg bg-accent transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-accent group-hover:rounded-2xl"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
