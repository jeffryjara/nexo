import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove lg:row-span-2 from IHC
content = content.replace('lg:row-span-2 ', '')

# 2. Add the signature card at the end of the grid
signature_card = """
            <!-- Firmas de los desarrolladores -->
            <div class="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center h-full animate-fade-in" style="animation-delay: 0.5s; background-color: transparent; border-style: dashed;">
                <p class="text-text-muted text-sm uppercase tracking-widest font-semibold mb-4">Desarrollado por</p>
                <div class="flex items-center gap-4 justify-center" style="font-family: 'Caveat', cursive;">
                    <span class="text-4xl text-white opacity-90 transform -rotate-2">J3T</span>
                    <span class="text-accent text-2xl opacity-50">&amp;</span>
                    <span class="text-4xl text-white opacity-90 transform rotate-2">JuanHP</span>
                </div>
            </div>
        </div>
"""

# Replace the closing div of the grid with the new card + the closing div
content = re.sub(r'</div>\s*</div>\s*</MainLayout>', signature_card.lstrip() + '    </div>\n</MainLayout>', content)

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
