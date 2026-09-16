css_content = """@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg: var(--bg-color);
  --color-surface: var(--surface-color);
  --color-border: var(--border-color);
  --color-text-main: var(--text-color);
  --color-text-muted: var(--text-muted);
  
  --color-accent: var(--accent-color);
  --color-accent-hover: var(--accent-hover);
  --color-accent-soft: var(--accent-soft);
  
  --color-success: var(--success-color);
  --color-success-soft: var(--success-soft);
  
  --color-error: var(--error-color);
  --color-error-soft: var(--error-soft);
  
  --color-warning: var(--warning-color);
  --color-warning-soft: var(--warning-soft);
}

:root {
  --bg-color: #ffffff;
  --surface-color: #ffffff;
  --border-color: #e2e8f0;
  --text-color: #0f172a;
  --text-muted: #64748b;
  
  --accent-color: #1d4ed8;
  --accent-hover: #1e40af;
  --accent-soft: #eff6ff;
  
  --success-color: #15803d;
  --success-soft: #f0fdf4;
  
  --error-color: #b91c1c;
  --error-soft: #fef2f2;
  
  --warning-color: #b45309;
  --warning-soft: #fffbeb;
  
  --bg-gradient: radial-gradient(circle at top, #f8fafc 0%, #ffffff 100%);
}

html.dark {
  --bg-color: #000000;
  --surface-color: rgba(10, 10, 10, 0.7); /* Translucent dark surface */
  --border-color: #1a1a1a;
  --text-color: #ffffff;
  --text-muted: #a1a1aa;
  
  --accent-color: #60a5fa;
  --accent-hover: #3b82f6;
  --accent-soft: rgba(37, 99, 235, 0.15);
  
  --success-color: #4ade80;
  --success-soft: rgba(34, 197, 94, 0.15);
  
  --error-color: #f87171;
  --error-soft: rgba(239, 68, 68, 0.15);
  
  --warning-color: #fbbf24;
  --warning-soft: rgba(245, 158, 11, 0.15);
  
  /* Deep midnight glow to black */
  --bg-gradient: radial-gradient(circle at top, #060e20 0%, #000000 70%, #000000 100%);
}

body {
    background-color: var(--bg-color);
    background-image: var(--bg-gradient);
    background-attachment: fixed;
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    transition: background-color 0.4s ease, color 0.4s ease;
}

::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: transparent; 
}
::-webkit-scrollbar-thumb {
    background: var(--border-color); 
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted); 
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Glassmorphism helpers */
.glass-panel {
    background-color: var(--surface-color);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border-color);
}
"""

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("global.css updated.")
