import React from "react";

export const InteractiveHoverButton = React.forwardRef(({ text = "Comprobar solución", className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#9333ea] bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-bold text-lg py-5 px-8 shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-purple-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto min-w-[220px] cursor-pointer ${className || ""}`}
      {...props}
    >
      {/* Shimmer light sweep effect on hover */}
      <span 
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" 
      />
      
      {/* Icon with smooth pop micro-interaction */}
      <svg 
        className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>

      {/* Button Text */}
      <span className="tracking-wide whitespace-nowrap">{text}</span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
