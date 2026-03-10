// Файл: _vitepress-labs/labs/lingo/lab3/solutions.ts

import type { InteractiveRunnerProps } from "../../../components/InteractiveRunner.vue";

const OPERATORS: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
  sin: 4,
};

const isOperator = (char: string) => ["+", "-", "*", "/", "^"].includes(char);
const isFunction = (char: string) => char == "sin";
const isNumber = (str: string) =>
  !isNaN(parseFloat(str)) && isFinite(Number(str));

class AdvancedCalculator {
  validateAndTokenize(expression: string): string[] {
    const regex = /([a-zA-Z]+|\d+\.\d+|\d+|[+\-*/^()])/g;
    const tokens = expression.match(regex) || [];
    let openParens = 0;
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];
      const prev = i > 0 ? tokens[i - 1] : null;
      if (/^[a-zA-Z]+$/.test(curr)) {
        if (!isFunction(curr)) {
          throw new Error(
            `неправильное выражение, неизвестное имя функции «${curr}»`,
          );
        }
      }

      if (curr == "(") {
        openParens++;
        if (prev == ")" || (prev && isNumber(prev))) {
          throw new Error(
            "неправильное выражение, отсутствует оператор между скобками/числом",
          );
        }
      }

      if (curr == ")") {
        openParens--;
        if (openParens < 0) {
          throw new Error("неправильное выражение, лишняя закрывающая скобка");
        }
      }

      if (isNumber(curr) && prev == ")") {
        throw new Error(
          "неправильное выражение, нет оператора между скобкой и числом",
        );
      }

      if (isOperator(curr) && prev && isOperator(prev)) {
        throw new Error(
          "неправильное выражение, два арифметических оператора подряд",
        );
      }
    }

    if (openParens != 0) {
      throw new Error("неправильное выражение, не хватает закрывающей скобки");
    }

    return tokens;
  }

  toPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const opStack: string[] = [];

    for (const token of tokens) {
      if (isNumber(token)) {
        output.push(token);
      } else if (isFunction(token)) {
        opStack.push(token);
      } else if (token == "(") {
        opStack.push(token);
      } else if (token == ")") {
        while (opStack.length > 0 && opStack[opStack.length - 1] != "(") {
          output.push(opStack.pop()!);
        }
        opStack.pop();
        if (opStack.length > 0 && isFunction(opStack[opStack.length - 1])) {
          output.push(opStack.pop()!);
        }
      } else if (isOperator(token)) {
        while (
          opStack.length > 0 &&
          opStack[opStack.length - 1] != "(" &&
          OPERATORS[opStack[opStack.length - 1]] >= OPERATORS[token]
        ) {
          output.push(opStack.pop()!);
        }
        opStack.push(token);
      }
    }

    while (opStack.length > 0) {
      output.push(opStack.pop()!);
    }

    return output;
  }

  evaluatePostfix(postfix: string[]): number {
    const stack: number[] = [];

    for (const token of postfix) {
      if (isNumber(token)) {
        stack.push(Number(token));
      } else if (isFunction(token)) {
        if (stack.length < 1)
          throw new Error("Неверное количество аргументов для функции");
        const a = stack.pop()!;
        if (token == "sin") stack.push(Math.sin(a));
      } else if (isOperator(token)) {
        if (stack.length < 2)
          throw new Error("Неверное выражение (не хватает операндов)");
        const b = stack.pop()!;
        const a = stack.pop()!;

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

    if (stack.length != 1) throw new Error("Синтаксическая ошибка в выражении");
    return stack.pop()!;
  }
}

export const task7Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите математическое выражение:",
    placeholder: "Например: sin(sin(0.2)+0.1)/(4-2)",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Введите выражение!");
    return input.replace(/\s+/g, "");
  },
  solution: (expression: string): string => {
    const calc = new AdvancedCalculator();
    try {
      const tokens = calc.validateAndTokenize(expression);
      const postfix = calc.toPostfix(tokens);
      const result = calc.evaluatePostfix(postfix);

      return `== АНАЛИЗ УСПЕШЕН ==\n\nТокены: [ ${tokens.join(" ")} ]\nПостфикс: [ ${postfix.join(" ")} ]\n\nРезультат: ${result.toFixed(2)}`;
    } catch (err: any) {
      return `ОШИБКА: ${err.message}`;
    }
  },
};
