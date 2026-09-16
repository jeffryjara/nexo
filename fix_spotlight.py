import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Pointer tracking logic
old_sync = """    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };"""

new_sync = """    const syncPointer = (e: PointerEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      }
    };"""
content = content.replace(old_sync, new_sync)

# Remove backgroundAttachment: 'fixed'
content = content.replace("backgroundAttachment: 'fixed',", "/* removed fixed attachment */")
content = content.replace("background-attachment: fixed;", "/* removed fixed attachment */")

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
