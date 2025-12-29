#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix >> at the start of JSX text content (like ">>&gt; text</div>")
content = re.sub(r'">>\s*{', r'">{">>"} {', content)
content = re.sub(r'">>([^{<])', r'">{">>"}\1', content)

# Fix -> in JSX text (arrow operators)
content = re.sub(r'([A-Za-z])\s+->\s+([A-Za-z])', r'\1 {"->"} \2', content)

# Fix bare > or < followed by numbers (like >18 or <18) in text
# Avoid already-escaped patterns like {">"}{
content = re.sub(r'(?<![{"])>(\d)', r'{">"}}\1', content)
content = re.sub(r'(?<![{"])<(\d)', r'{"<"}}\1', content)

# Fix HTML entities &gt; and &lt; with numbers
content = re.sub(r'&gt;(\d)', r'{">"}}\1', content)
content = re.sub(r'&lt;(\d)', r'{"<"}}\1', content)

# Clean up any double-escaped patterns that might have been created
content = re.sub(r'\{">"}\{1\}', r'{">"}', content)
content = re.sub(r'\{"<"\}\{1\}', r'{"<"}', content)

# Fix checkAnswer({'string'}) to checkAnswer('string')
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSX syntax in {filepath}")
