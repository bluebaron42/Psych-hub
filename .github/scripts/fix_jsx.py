#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix HTML entities - these are always safe
content = re.sub(r'&lt;', r'{"<"}', content)
content = re.sub(r'&gt;', r'{">"}', content)

# Fix >> at start of text (after tag closing >)
content = re.sub(r'(>)>>\s+', r'\1{">>"} ', content)

# Fix -> surrounded by spaces (text, not code)
content = re.sub(r'(\s)->(\s)', r'\1{"->"}\2', content)

# Fix < or > followed by numbers ONLY in plain text within parentheses
# Match: (<18mo) or (>18mo) but NOT inside template literals or JSX expressions
# Only match when it's clearly descriptive text
content = re.sub(r'\(([A-Za-z\s]+)<(\d+[a-z]+)\)', r'({\1{"<"}\2})', content)
content = re.sub(r'\(([A-Za-z\s]+)>(\d+[a-z]+)\)', r'({\1{">"}\2})', content)

# Fix checkAnswer({'string'}) to checkAnswer('string')
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSX syntax in {filepath}")
