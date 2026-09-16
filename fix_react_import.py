import re

with open('src/components/ui/spotlight-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import
content = content.replace(
    "import React, { useEffect, useRef, ReactNode } from 'react';",
    "import React, { useEffect, useRef } from 'react';\nimport type { ReactNode } from 'react';"
)

with open('src/components/ui/spotlight-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
