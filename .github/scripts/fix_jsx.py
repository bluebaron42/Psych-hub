#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix HTML entities first - these are always safe to replace
content = re.sub(r'&lt;', r'{"<"}', content)
content = re.sub(r'&gt;', r'{">"}', content)

# Fix >> at beginning of text content (but not after attributes)
# Match >> that appears after a closing > of a tag
content = re.sub(r'(>)>>\s+', r'\1{">>"} ', content)

# Fix -> in text (spaces on both sides indicate it's text, not code)
content = re.sub(r'(\s)->(\s)', r'\1{"->"}\2', content)

# Fix standalone > or < followed by numbers in PARENTHESES (text descriptions)
# Like "(>18 months)" should become "({">"}}18 months)"
content = re.sub(r'\(([^)]*?)>(\d)', r'({\1{">"}}\2', content)
content = re.sub(r'\(([^)]*?)<(\d)', r'({\1{"<"}}\2', content)

# Fix checkAnswer({'string'}) to checkAnswer('string')
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSX syntax in {filepath}")
