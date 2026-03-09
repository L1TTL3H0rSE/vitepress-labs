import { Stack } from "../../mathlogic/lab2/lab2_1";

const OPERATORS: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
};

// Проверки
const isOperator = (char: string) => char in OPERATORS;
const isNumber = (str: string) =>
  !isNaN(parseFloat(str)) && isFinite(Number(str));

export class MathExpressionProcessor {
  private _toPostfixFromTokens(tokens: string[]) {
    const output: string[] = [];
    const opStack = new Stack<string>();

    for (const token of tokens) {
      if (isNumber(token)) {
        output.push(token);
      } else if (token == "(") {
        opStack.push(token);
      } else if (token == ")") {
        while (!opStack.is_empty() && opStack.peek() != "(") {
          output.push(opStack.pop());
        }
        if (!opStack.is_empty() && opStack.peek() == "(") {
          opStack.pop();
        } else {
          throw new Error("Mismatched parentheses");
        }
      } else if (isOperator(token)) {
        while (
          !opStack.is_empty() &&
          opStack.peek() != "(" &&
          OPERATORS[opStack.peek()] >= OPERATORS[token]
        ) {
          output.push(opStack.pop());
        }
        opStack.push(token);
      } else {
        throw new Error(`Unknown token: ${token}`);
      }
    }

    while (!opStack.is_empty()) {
      const op = opStack.pop();
      if (op == "(" || op == ")") throw new Error("Mismatched parentheses");
      output.push(op);
    }

    return output;
  }

  tokenize(expression: string): string[] {
    const regex = /\s*([0-9]+\.?[0-9]*|\+|\-|\*|\/|\^|\(|\))\s*/g;
    return expression.split(regex).filter((t) => t.trim() != "");
  }

  toPostfix(expression: string): string[] {
    const tokens = this.tokenize(expression);
    return this._toPostfixFromTokens(tokens);
  }

  evaluatePostfix(postfix: string[]): number {
    const stack = new Stack<number>();

    for (const token of postfix) {
      if (isNumber(token)) {
        stack.push(Number(token));
      } else if (isOperator(token)) {
        if (stack.size() < 2) throw new Error("Invalid expression");
        const b = stack.pop();
        const a = stack.pop();

        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
          case "^":
            stack.push(Math.pow(a, b));
            break;
        }
      }
    }

    if (stack.size() != 1) throw new Error("Invalid expression");
    return stack.pop();
  }

  toPrefix(expression: string): string[] {
    let tokens = this.tokenize(expression).reverse();

    tokens = tokens.map((t) => {
      if (t == "(") return ")";
      if (t == ")") return "(";
      return t;
    });

    const postfixReversed = this._toPostfixFromTokens(tokens);

    return postfixReversed.reverse();
  }
}
