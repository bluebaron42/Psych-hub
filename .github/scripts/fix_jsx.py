#!/usr/bin/env python3
import sys
import re

if len(sys.argv) < 2:
    print("Usage: fix_jsx.py <file>")
    sys.exit(1)

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Track fixes for reporting
fixes_made = []

# Fix HTML entities - handle various patterns
# Pattern 1: &lt; and &gt; with numbers/text (e.g., "&lt;18mo" or "(&lt;18 months)")
original = content
content = re.sub(r'&lt;', '{"<"}', content)
content = re.sub(r'&gt;', '{">"}', content)
content = re.sub(r'&amp;', '{"&"}', content)
if content != original:
    fixes_made.append("HTML entities (&lt;, &gt;, &amp;)")

# Fix > at start of line/text (common in terminal-style output)
# Matches patterns like: > SOME TEXT or              > SOME TEXT
original = content
content = re.sub(r'(\s+|^)>\s+([A-Z_])', r'\1{">"} \2', content, flags=re.MULTILINE)
if content != original:
    fixes_made.append("Single angle bracket at line start (>)")

# Fix >> at start of text (after tag closing >)
original = content
content = re.sub(r'(>)>>\s+', r'\1{">>"} ', content)
if content != original:
    fixes_made.append("Double angle brackets (>>)")

# Fix -> surrounded by spaces (text, not code) - make sure it's in JSX text content
original = content
content = re.sub(r'(\s)->(\s)', r'\1{"->"}\2', content)
if content != original:
    fixes_made.append("Arrow operators (->)")

# Fix checkAnswer({'string'}) to checkAnswer('string')
original = content
content = re.sub(r"checkAnswer\(\{'([^']+)'\}\)", r"checkAnswer('\1')", content)
if content != original:
    fixes_made.append("checkAnswer quote wrapping")

# Additional pattern: Fix any remaining < or > in text that might cause issues
# This specifically targets cases like "short-term (<18 months)" in JSX text
# We look for patterns where < or > appear followed by digits in parentheses
original = content
content = re.sub(r'\(\s*<\s*(\d+)', r'({"<"}\1', content)
content = re.sub(r'\(\s*>\s*(\d+)', r'({">"}\1', content)
if content != original:
    fixes_made.append("Comparison operators in parentheses")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

if fixes_made:
    print(f"✅ Fixed JSX syntax in {filepath}")
    print(f"   Applied fixes: {', '.join(fixes_made)}")
else:
    print(f"ℹ️  No JSX fixes needed in {filepath}")
