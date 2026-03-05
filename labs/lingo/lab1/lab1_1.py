class PushdownAutomata:
    def __init__(self, pairs: dict):
        self.bracket_pairs = pairs
        self.opening_brackets = set(pairs.keys())
        self.closing_brackets = set(pairs.values())
        self.stack = []

    def clean(self):
        self.stack.clear()

    def process(self, sequence: str) -> bool:
        self.clean()
        for ch in sequence:
            if ch in self.opening_brackets:
                self.stack.append(ch)
                continue
            
            if ch in self.closing_brackets:
                if len(self.stack) == 0:
                    raise Exception("Wrong sequence! (Stack is empty)")
                
                last = self.stack.pop()
                expected = self.bracket_pairs[last]
                
                if expected != ch:
                    raise Exception(f"Wrong sequence! Expected {expected}, got {ch}")
        
        if len(self.stack) > 0:
            raise Exception("Wrong sequence! Not all brackets were closed!")
            
        return True