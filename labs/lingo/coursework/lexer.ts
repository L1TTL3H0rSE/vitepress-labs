export enum TokenType {
  Keyword = "Keyword",
  Identifier = "Identifier",
  Number = "Number",
  Operator = "Operator",
  Punctuation = "Punctuation",
  EOF = "EOF",
  Error = "Error",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

const KEYWORDS = new Set([
  "целое",
  "матрица",
  "ввод",
  "вывод",
  "пока",
  "если",
  "иначе",
  "сортировать",
]);

const OPERATORS = new Set([
  "=",
  ">=",
  "<=",
  "+",
  "-",
  "==",
  "!=",
  ">",
  "<",
  "!",
]);

const PUNCTUATION = new Set(["[", "]", "(", ")", ";", "{", "}"]);

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  private isEOF(): boolean {
    return this.position >= this.source.length;
  }

  private peek(): string {
    if (this.isEOF()) return "\0";
    return this.source[this.position];
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    this.column++;
    if (char == "\n") {
      this.line++;
      this.column = 1;
    }
    return char;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isEOF()) {
      const char = this.peek();
      if (/\s/.test(char)) {
        this.advance();
        continue;
      }
      if (/[0-9]/.test(char)) {
        let value = "";
        while (/[0-9]/.test(this.peek())) {
          value += this.advance();
        }
        tokens.push({
          type: TokenType.Number,
          value,
          line: this.line,
          column: this.column - 1,
        });
        continue;
      }
      if (/^[\p{L}_]$/u.test(char)) {
        let value = "";
        while (/^[\p{L}_0-9]$/u.test(this.peek())) {
          value += this.advance();
        }

        tokens.push({
          type: KEYWORDS.has(value) ? TokenType.Keyword : TokenType.Identifier,
          value,
          line: this.line,
          column: this.column - 1,
        });
        continue;
      }
      if (PUNCTUATION.has(char)) {
        tokens.push({
          type: TokenType.Punctuation,
          value: char,
          line: this.line,
          column: this.column,
        });
        this.advance();
        continue;
      }
      if (OPERATORS.has(char)) {
        this.advance();
        const next = this.peek();
        const joined = [char, next].join("");
        if (OPERATORS.has(joined)) {
          tokens.push({
            type: TokenType.Operator,
            value: joined,
            line: this.line,
            column: this.column,
          });
          this.advance();
          continue;
        }
        tokens.push({
          type: TokenType.Operator,
          value: char,
          line: this.line,
          column: this.column - 1,
        });
        continue;
      }
      throw new Error(
        `Лексическая ошибка: неизвестный символ '${char}' на строке ${this.line}, позиция ${this.column}`,
      );
    }

    tokens.push({
      type: TokenType.EOF,
      value: "",
      line: this.line,
      column: this.column,
    });

    return tokens;
  }
}
