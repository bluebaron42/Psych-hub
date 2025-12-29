#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix >> at beginning of text content in JSX
content = re.sub(r'([">])>>\s+\{', r'\1{">>"} {', content)

# Fix standalone >> in JSX attributes
content = re.sub(r'">>([^{])', r'"{">>"}\1', content)

# Fix -> in JSX text (arrow operators)
content = re.sub(r'(\s)->(\s)', r'\1{"->"}\2', content)

# Fix HTML entities first
content = re.sub(r'&lt;', r'{"<"}', content)
content = re.sub(r'&gt;', r'{">"}', content)

# Fix broken replacements like {">"}{1}8 back to {">"}18
content = re.sub(r'\{"([<>])"\}\{(\d+)\}', r'{"\1"}\2', content)

# Fix remaining standalone > or < followed by numbers in text (like >18 or <18)
# Only inside JSX text content (after > and before <)
content = re.sub(r'(\([^)]*?)>(\d)', r'\1{">"}\2', content)
content = re.sub(r'(\([^)]*?)<(\d)', r'\1{"<"}\2', content)

# Fix checkAnswer({'string'}) to checkAnswer('string')
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSX syntax in {filepath}")
