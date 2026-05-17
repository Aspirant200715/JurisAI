from agents import extract_clauses, assess_risk, translate_to_human

# A simple text with a bad clause
test_text = """
I agree to work for free for 2 years. 
I also agree that my employer owns my soul and my cat.
"""

print("Testing Agent 1 (Extraction)...")
extraction = extract_clauses(test_text)
print(extraction.model_dump_json(indent=2))
