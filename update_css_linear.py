css_content = """@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg-light: #ffffff;
  --color-surface-light: #ffffff;
  --color-border-light: rgba(0, 0, 0, 0.08);
  --color-text-main-light: #111111;
  --color-text-muted-light: #666666;
  --color-accent-light: #4338ca;
  --color-accent-soft-light: #eef2ff;

  --color-bg-dark: #000000;
  --color-surface-dark: rgba(255, 255, 255, 0.02);
  --color-border-dark: rgba(255, 255, 255, 0.08);
  --color-text-main-dark: #f7f8f8;
  --color-text-muted-dark: #8a8f98;
  --color-accent-dark: #818cf8;
  --color-accent-soft-dark: rgba(99, 102, 241, 0.1);
  
  --color-warning-light: #b45309;
  --color-warning-soft-light: #fffbeb;
  --color-warning-dark: #f59e0b;
  --color-warning-soft-dark: rgba(245, 158, 11, 0.1);
  
  --color-error-light: #b91c1c;
  --color-error-soft-light: #fef2f2;
  --color-error-dark: #f87171;
  --color-error-soft-dark: rgba(239, 68, 68, 0.1);
  
  --color-success-light: #15803d;
  --color-success-soft-light: #f0fdf4;
  --color-success-dark: #4ade80;
  --color-success-soft-dark: rgba(34, 197, 94, 0.1);
}

:root {
  --bg-color: var(--color-bg-light);
  --surface-color: var(--color-surface-light);
  --border-color: var(--color-border-light);
  --text-main: var(--color-text-main-light);
  --text-muted: var(--color-text-muted-light);
  --accent-color: var(--color-accent-light);
  --accent-soft: var(--color-accent-soft-light);
  --warning-color: var(--color-warning-light);
  --warning-soft: var(--color-warning-soft-light);
  --error-color: var(--color-error-light);
  --error-soft: var(--color-error-soft-light);
  --success-color: var(--color-success-light);
  --success-soft: var(--color-success-soft-light);
  
  --bg-gradient: radial-gradient(100% 100% at 50% 0%, rgba(220, 230, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%);
}

html.dark {
  --bg-color: var(--color-bg-dark);
  --surface-color: var(--color-surface-dark);
  --border-color: var(--color-border-dark);
  --text-main: var(--color-text-main-dark);
  --text-muted: var(--color-text-muted-dark);
  --accent-color: var(--color-accent-dark);
  --accent-soft: var(--color-accent-soft-dark);
  --warning-color: var(--color-warning-dark);
  --warning-soft: var(--color-warning-soft-dark);
  --error-color: var(--color-error-dark);
  --error-soft: var(--color-error-soft-dark);
  --success-color: var(--color-success-dark);
  --success-soft: var(--color-success-soft-dark);
  
  --bg-gradient: radial-gradient(100% 100% at 50% 0%, rgba(67, 56, 202, 0.15) 0%, rgba(0, 0, 0, 0) 50%);
}

@theme {
  --color-bg: var(--bg-color);
  --color-surface: var(--surface-color);
  --color-border: var(--border-color);
  --color-text-main: var(--text-main);
  --color-text-muted: var(--text-muted);
  --color-accent: var(--accent-color);
  --color-accent-soft: var(--accent-soft);
  --color-warning: var(--warning-color);
  --color-warning-soft: var(--warning-soft);
  --color-error: var(--error-color);
  --color-error-soft: var(--error-soft);
  --color-success: var(--success-color);
  --color-success-soft: var(--success-soft);
}

body {
    background-color: var(--bg-color);
    background-image: var(--bg-gradient);
    background-attachment: fixed;
    background-repeat: no-repeat;
    color: var(--text-main);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
    letter-spacing: -0.01em;
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
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.glass-panel {
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}
html.dark .glass-panel {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
}
"""

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("global.css updated for Linear style.")
