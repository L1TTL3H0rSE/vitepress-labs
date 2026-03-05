import { Stack } from "../../mathlogic/lab2/lab2_1";

export const BRACKET_PAIRS: Record<string, string> = {
  "(": ")",
  "{": "}",
  "[": "]",
} as const;

export type OpeningBrackets = keyof typeof BRACKET_PAIRS;

export type ClosingBrackets = (typeof BRACKET_PAIRS)[OpeningBrackets];

export class PushdownAutomata<O extends string, C extends string> extends Stack<
  O | C
> {
  private readonly bracketPairs: Record<O, C>;
  private readonly openingBrackets: Set<O>;
  private readonly closingBrackets: Set<C>;

  constructor(pairs: Record<O, C>) {
    super();
    this.bracketPairs = pairs;
    this.openingBrackets = new Set(Object.keys(pairs) as O[]);
    this.closingBrackets = new Set(Object.values(pairs) as C[]);
  }

  private isOpening(char: string): char is O {
    return this.openingBrackets.has(char as O);
  }

  private isClosing(char: string): char is C {
    return this.closingBrackets.has(char as C);
  }

  clean() {
    while (!this.is_empty()) {
      this.pop();
    }
  }

  process(sequence: string) {
    this.clean();
    for (const ch of sequence) {
      if (this.isOpening(ch)) {
        this.push(ch);
        continue;
      }
      if (this.isClosing(ch)) {
        if (this.is_empty()) {
          throw new Error("Wrong sequence!");
        }
        const last = this.pop();
        const expected = this.bracketPairs[last as O];

        if (expected != ch) {
          throw new Error(`Wrong sequence! Expected ${expected}, got ${ch}`);
        }
      }
    }

    if (!this.is_empty()) {
      throw new Error("Wrong sequence! Not all brackets were closed!");
    }

    return true;
  }
}
