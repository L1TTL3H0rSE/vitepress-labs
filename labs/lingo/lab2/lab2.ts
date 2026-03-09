import type { InteractiveRunnerProps } from "../../../components/InteractiveRunner.vue";

export const task3Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите код с макросами:",
    placeholder:
      "#define cikl(y) for(int i=1; i<=y; i++)\n#define inc(x) x++;\n\nint q=1, d=9;\ncikl(d){\n  inc(q);\n}",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Код не может быть пустым!");
    return input;
  },
  solution: (code: string): string => {
    const lines = code.split("\n");
    const macros: Record<string, { args: string[]; body: string }> = {};
    const outputLines: string[] = [];
    const defineRegex = /^#define\s+(\w+)(?:\(([^)]+)\))?\s+(.+)$/;

    for (const line of lines) {
      const match = line.match(defineRegex);
      if (match) {
        const name = match[1];
        const args = match[2] ? match[2].split(",").map((s) => s.trim()) : [];
        const body = match[3].trim();
        macros[name] = { args, body };
        continue;
      }

      let processedLine = line;

      for (const [name, macro] of Object.entries(macros)) {
        if (macro.args.length > 0) {
          const callRegex = new RegExp(`\\b${name}\\(([^)]+)\\)`, "g");
          processedLine = processedLine.replace(
            callRegex,
            (fullMatch, callArgsStr) => {
              const callArgs = callArgsStr
                .split(",")
                .map((s: string) => s.trim());
              let expandedBody = macro.body;
              macro.args.forEach((argName, idx) => {
                const argRegex = new RegExp(`\\b${argName}\\b`, "g");
                expandedBody = expandedBody.replace(
                  argRegex,
                  callArgs[idx] || "",
                );
              });
              return expandedBody;
            },
          );
        } else {
          const callRegex = new RegExp(`\\b${name}\\b`, "g");
          processedLine = processedLine.replace(callRegex, macro.body);
        }
      }
      outputLines.push(processedLine);
    }

    return "=== ПОСЛЕ РАБОТЫ ПРЕПРОЦЕССОРА ===\n\n" + outputLines.join("\n");
  },
};

export const task4Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите текст для сокращения:",
    placeholder:
      "Проверка вывода текста производится согласно установленного правила",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Введите текст!");
    return input;
  },
  solution: (text: string): string => {
    const wordRegex = /[а-яА-ЯёЁ]+/g;
    const shortenPattern =
      /^([^аеёиоуыэюяАЕЁИОУЫЭЮЯ]*[аеёиоуыэюяАЕЁИОУЫЭЮЯ]+[бвгджзйклмнпрстфхцчшщБВГДЖЗЙКЛМНПРСТФХЦЧШЩ]+)(.*)$/i;
    const shortenedText = text.replace(wordRegex, (word) => {
      const match = word.match(shortenPattern);
      if (match && match[2].length > 0) {
        return match[1] + ".";
      }
      return word;
    });

    return shortenedText;
  },
};

export const task5Props: InteractiveRunnerProps<string> = {
  inputProps: {
    label: "Введите исходный код C++:",
    placeholder:
      "int i, mas[100], j;\nfloat Mod, r11;\ndouble tempValue;\ni = mas[j] - sin(r11);\ntempValue = i * 2.5;",
  },
  mapper: (input: string) => {
    if (!input.trim()) throw new Error("Код не может быть пустым!");
    return input;
  },
  solution: (code: string): string => {
    const varMap: Record<string, string> = {};
    const declRegex = /\b(int|double)\s+([^;]+);/g;
    let match;

    while ((match = declRegex.exec(code)) !== null) {
      const type = match[1];
      const prefix = type === "int" ? "i" : "d";
      const varsStr = match[2];

      const vars = varsStr.split(",");
      for (const v of vars) {
        const idMatch = v.match(/\b([a-zA-Z_]\w*)\b/);
        if (idMatch) {
          const oldName = idMatch[1];
          if (!oldName.startsWith(prefix)) {
            varMap[oldName] = prefix + oldName;
          } else {
            varMap[oldName] = oldName;
          }
        }
      }
    }

    let processedCode = code;
    const sortedKeys = Object.keys(varMap).sort((a, b) => b.length - a.length);

    for (const oldName of sortedKeys) {
      const newName = varMap[oldName];
      if (oldName !== newName) {
        const replaceRegex = new RegExp(`\\b${oldName}\\b`, "g");
        processedCode = processedCode.replace(replaceRegex, newName);
      }
    }

    return "=== КОД ПОСЛЕ РЕФАКТОРИНГА ===\n\n" + processedCode;
  },
};
