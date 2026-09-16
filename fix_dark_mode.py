import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove hardcoded class="dark"
content = content.replace('<html lang="es" class="dark">', '<html lang="es">')

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    jsx_content = f.read()

# Update React state initialization to check localStorage and system preference
react_logic = """
            const [isDarkMode, setIsDarkMode] = useState(false);

            useEffect(() => {
                // Check local storage or system preference on mount
                const isDark = localStorage.getItem('theme') === 'dark' || 
                              (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                setIsDarkMode(isDark);
            }, []);

            useEffect(() => {
                if (isDarkMode) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
            }, [isDarkMode]);
"""

jsx_content = re.sub(
    r'const \[isDarkMode, setIsDarkMode\] = useState\(true\);\s*useEffect\(\(\) => \{\s*if \(isDarkMode\) \{\s*document\.documentElement\.classList\.add\(\'dark\'\);\s*\} else \{\s*document\.documentElement\.classList\.remove\(\'dark\'\);\s*\}\s*\}, \[isDarkMode\]\);',
    react_logic.strip(),
    jsx_content
)

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx_content)

print("Dark mode toggle logic and default state fixed.")
