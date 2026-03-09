import type { InteractiveRunnerProps } from "../../../components/InteractiveRunner.vue";

export const task1Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите код на C++:",
    placeholder:
      "int main() {\n  int a = 5 * 2;\n  do {\n    a = a / 2;\n  } while(a > 0);\n}",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Текст программы не может быть пустым!");
    return input;
  },
  solution: (code: string): string => {
    const lines = code.split("\n");

    const results = {
      do: [] as number[],
      while: [] as number[],
      "*": [] as number[],
      "/": [] as number[],
    };

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      if (/\bdo\b/.test(line)) results["do"].push(lineNum);
      if (/\bwhile\b/.test(line)) results["while"].push(lineNum);
      if (/\*/.test(line)) results["*"].push(lineNum);
      if (/\//.test(line)) results["/"].push(lineNum);
    });

    let output = "=== РЕЗУЛЬТАТЫ ПОИСКА ===\n\n";
    for (const [token, linesArr] of Object.entries(results)) {
      output += `Токен "${token}": найдено ${linesArr.length} шт.\n`;
      if (linesArr.length > 0) {
        output += `Строки: ${linesArr.join(", ")}\n`;
      }
      output += "------------------------\n";
    }

    return output.trim();
  },
};

export const task2Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите объявление макроса:",
    placeholder: "#define MYCONST 12345L",
  },
  mapper: (input: string) => input.trim(),
  solution: (line: string): string => {
    const defineRegex = /^#define\s+MYCONST\s+(.+)$/;
    const match = line.match(defineRegex);

    if (!match) {
      return "Ошибка: Строка не соответствует формату '#define MYCONST <значение>'";
    }

    const value = match[1].trim();
    const longIntRegex = /^[+-]?\d+[lL]?$/;

    if (longIntRegex.test(value)) {
      return `Анализ пройден успешно!\nЗначение '${value}' ЯВЛЯЕТСЯ целой (возможно длинной) константой.`;
    } else {
      if (value.includes(".") || value.includes("e") || value.includes("E")) {
        return `Значение '${value}' НЕ является целой константой (похоже на число с плавающей точкой).`;
      }
      return `Значение '${value}' НЕ является целой константой (содержит недопустимые символы).`;
    }
  },
};

export const task6Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите строку для поиска чисел:",
    placeholder: "iu-0.12+t5r/67=we2q",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Введите строку!");
    return input;
  },
  solution: (text: string): string => {
    const numberRegex =
      /(?<![\w\.])(?:\d+\.\d+(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+|\d+)(?![\w\.])/g;

    const matches = text.match(numberRegex);

    if (!matches || matches.length === 0) {
      return "В тексте числа не обнаружены.";
    }

    return `=== НАЙДЕННЫЕ ЧИСЛА ===\n\nКоличество: ${matches.length}\nЧисла: ${matches.join(", ")}`;
  },
};
