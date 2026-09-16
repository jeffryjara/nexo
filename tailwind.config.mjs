/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        border: 'var(--border-color)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent-color)',
        'accent-soft': 'var(--accent-soft)',
        warning: 'var(--warning-color)',
        'warning-soft': 'var(--warning-soft)',
        error: 'var(--error-color)',
        'error-soft': 'var(--error-soft)',
        success: 'var(--success-color)',
        'success-soft': 'var(--success-soft)'
      }
    }
  },
  plugins: [],
}
