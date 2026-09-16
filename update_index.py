import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Title to Nexo
content = content.replace('<h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Mis Cursos</h1>', '<h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Nexo</h1>')
content = content.replace('title="Mis Cursos - Plataforma de Estudio"', 'title="Nexo - Plataforma de Estudio"')

# Add the import statement
import_statement = "import { GlowCard } from '../components/ui/spotlight-card';\n"
if "import { GlowCard }" not in content:
    content = content.replace("import MainLayout from '../layouts/MainLayout.astro';", "import MainLayout from '../layouts/MainLayout.astro';\n" + import_statement)

# Replace the 5 course cards with GlowCard wrappers.
# Curso 1
c1_old = r'<a href="/arquitectura" class="glass-panel p-8 rounded-3xl border border-white/5 hover:-translate-y-2 hover:border-accent hover:shadow-\[0_0_30px_rgba\(67\,56\,202\,0\.3\)\] transition-all duration-300 group flex flex-col h-full animate-fade-in">'
c1_new = r"""<a href="/arquitectura" class="block h-full animate-fade-in group hover:-translate-y-2 transition-transform duration-300">
                <GlowCard client:load customSize={true} glowColor="blue" className="!h-full !flex !flex-col !p-8 !gap-0 !rounded-3xl cursor-pointer">"""

c1_end_old = r'Entrar al laboratorio &rarr;\n                </div>\n            </a>'
c1_end_new = r'Entrar al laboratorio &rarr;\n                </div>\n                </GlowCard>\n            </a>'

content = re.sub(c1_old, c1_new, content)
content = re.sub(c1_end_old, c1_end_new, content)

# Cursos 2 to 5 loop replacing
for i, (href, delay, color) in enumerate([
    ('/grafica', '0.1s', 'purple'),
    ('/ihc', '0.2s', 'green'),
    ('/bd', '0.3s', 'orange'),
    ('/modelamiento', '0.4s', 'red')
]):
    c_old = rf'<a href="{href}" class="glass-panel p-8 rounded-3xl border border-white/5 hover:-translate-y-2 hover:border-accent hover:shadow-\[0_0_30px_rgba\(67\,56\,202\,0\.3\)\] transition-all duration-300 group flex flex-col h-full animate-fade-in" style="animation-delay: {delay}">'
    c_new = rf"""<a href="{href}" class="block h-full animate-fade-in group hover:-translate-y-2 transition-transform duration-300" style="animation-delay: {delay}">
                <GlowCard client:load customSize={{true}} glowColor="{color}" className="!h-full !flex !flex-col !p-8 !gap-0 !rounded-3xl cursor-pointer">"""
    
    content = re.sub(c_old, c_new, content)
    
    # finding the end of the a tag for these courses
    # They end with </p>\n            </a>
    end_old = r'</p>\n            </a>'
    # we need to be careful not to replace all at once, so we do it with regex that matches the content inside
    
# for the ends of courses 2-5, we can just replace </p>\n            </a> with </p>\n                </GlowCard>\n            </a> 4 times
content = content.replace('</p>\n            </a>', '</p>\n                </GlowCard>\n            </a>', 4)

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
