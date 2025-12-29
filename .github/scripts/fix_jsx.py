#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix >> at start of JSX text content
content = re.sub(r'(className="[^"]*")>>\s+{', r'\1>{">>"} {', content)

# Fix -> in JSX text (arrow operators in text)
content = re.sub(r'(\{[^}]*\})\s+->\s+(\{)', r'\1 {"->"} \2', content)

# Fix standalone > followed by numbers (like >18months)
content = re.sub(r'&gt;(\d)', r'{">"}{\1}', content)
content = re.sub(r'&lt;(\d)', r'{"<"}{\1}', content)

# Fix checkAnswer({'string'}) to checkAnswer('string')
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)

# Fix {...}`}>...` patterns (extra > after closing bracket)
content = re.sub(r'(\`\}){">"}', r'\1>', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSX syntax in {filepath}")
