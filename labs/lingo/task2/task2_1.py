import re
import math
from typing import List, Dict
from labs.lingo.task2.task2_1 import Stack

OPERATORS: Dict[str, int] = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
}

def is_operator(char: str) -> bool:
    return char in OPERATORS

def is_number(s: str) -> bool:
    try:
        val = float(s)
        return math.isfinite(val)
    except ValueError:
        return False

class MathExpressionProcessor:
    def _to_postfix_from_tokens(self, tokens: List[str]) -> List[str]:
        output: List[str] = []
        op_stack = Stack[str]()

        for token in tokens:
            if is_number(token):
                output.append(token)
            elif token == "(":
                op_stack.push(token)
            elif token == ")":
                while not op_stack.is_empty() and op_stack.peek() != "(":
                    output.append(op_stack.pop())
                
                if not op_stack.is_empty() and op_stack.peek() == "(":
                    op_stack.pop()
                else:
                    raise ValueError("Mismatched parentheses")
            elif is_operator(token):
                while (not op_stack.is_empty() and 
                       op_stack.peek() != "(" and 
                       OPERATORS[op_stack.peek()] >= OPERATORS[token]):
                    output.append(op_stack.pop())
                op_stack.push(token)
            else:
                raise ValueError(f"Unknown token: {token}")

        while not op_stack.is_empty():
            op = op_stack.pop()
            if op == "(" or op == ")":
                raise ValueError("Mismatched parentheses")
            output.append(op)

        return output

    def tokenize(self, expression: str) -> List[str]:
        regex = r'\s*([0-9]+\.?[0-9]*|\+|\-|\*|\/|\^|\(|\))\s*'
        tokens = re.split(regex, expression)
        return [t for t in tokens if t and t.strip() != ""]

    def to_postfix(self, expression: str) -> List[str]:
        tokens = self.tokenize(expression)
        return self._to_postfix_from_tokens(tokens)

    def evaluate_postfix(self, postfix: List[str]) -> float:
        stack = Stack[float]()

        for token in postfix:
            if is_number(token):
                stack.push(float(token))
            elif is_operator(token):
                if stack.size() < 2:
                    raise ValueError("Invalid expression")
                b = stack.pop()
                a = stack.pop()

                if token == "+":
                    stack.push(a + b)
                elif token == "-":
                    stack.push(a - b)
                elif token == "*":
                    stack.push(a * b)
                elif token == "/":
                    stack.push(a / b)
                elif token == "^":
                    stack.push(math.pow(a, b))
        
        if stack.size() != 1:
            raise ValueError("Invalid expression")
        
        return stack.pop()

    def to_prefix(self, expression: str) -> List[str]:
        tokens = self.tokenize(expression)
        tokens.reverse()
        swapped_tokens = []
        for t in tokens:
            if t == "(":
                swapped_tokens.append(")")
            elif t == ")":
                swapped_tokens.append("(")
            else:
                swapped_tokens.append(t)

        postfix_reversed = self._to_postfix_from_tokens(swapped_tokens)
        
        postfix_reversed.reverse()
        
        return postfix_reversed