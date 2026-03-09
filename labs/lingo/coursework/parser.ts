import { Token, TokenType } from "./lexer";
import * as AST from "./ast";

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private isEOF(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private match(type: TokenType, value?: string): boolean {
    if (this.isEOF()) return false;
    const token = this.peek();
    if (token.type != type) return false;
    if (value && token.value != value) return false;

    this.current++;
    return true;
  }

  private expect(type: TokenType, errorMessage: string, value?: string): Token {
    if (this.match(type, value)) {
      return this.previous();
    }
    const token = this.peek();
    throw new Error(
      `Синтаксическая ошибка [строка ${token.line}]: ${errorMessage}`,
    );
  }

  private parseCallExpression(): AST.CallExpression {
    const funcNameToken = this.tokens[this.current];
    this.current++;

    this.expect(
      TokenType.Punctuation,
      "Ожидалась '(' после имени функции",
      "(",
    );

    const argToken = this.expect(
      TokenType.Identifier,
      "Ожидалось имя переменной внутри скобок",
    );

    this.expect(TokenType.Punctuation, "Ожидалась ')'", ")");

    this.expect(TokenType.Punctuation, "Ожидалась ';' в конце строки", ";");

    return {
      type: "CallExpression",
      functionName: funcNameToken.value,
      argument: argToken.value,
    };
  }

  private parseVarDeclaration(): AST.VarDeclaration {
    const varType = this.tokens[this.current];
    this.current++;

    const varName = this.expect(
      TokenType.Identifier,
      "Ожидалось имя переменной",
    );

    let size: Token | undefined;

    if (varType.value == "матрица") {
      this.expect(
        TokenType.Punctuation,
        "Ожидалось [ после имени матрицы",
        "[",
      );

      size = this.expect(TokenType.Number, "Ожидался размер матрицы");

      this.expect(
        TokenType.Punctuation,
        "Ожидалось ] после размера матрицы",
        "]",
      );
    }

    this.expect(TokenType.Punctuation, "Ожидалось ; в конце строки", ";");

    return {
      type: "VarDeclaration",
      name: varName.value,
      dataType: varType.value as AST.VarDeclaration["dataType"],
      arraySize: size?.value ? Number(size.value) : undefined,
    };
  }

  private parseAssignment(): AST.Assignment {
    const identifier = this.tokens[this.current];
    this.current++;

    this.expect(TokenType.Operator, "Ожидалось = после имени переменной");

    const expression = this.parseExpression();

    this.expect(TokenType.Punctuation, "Ожидалось ; в конце строки", ";");

    return {
      assignee: identifier.value,
      type: "Assignment",
      value: expression,
    };
  }

  private parseExpression(): AST.Expression {
    return this.parseComparison();
  }

  private parseComparison(): AST.Expression {
    let expr = this.parseTerm();

    const token = this.peek();
    if (
      token.type == TokenType.Operator &&
      ["==", "!=", ">", "<", ">=", "<="].includes(token.value)
    ) {
      const operator = token.value;
      this.current++;
      const right = this.parseTerm();

      expr = {
        type: "BinaryExpr",
        left: expr,
        operator: operator,
        right: right,
      };
    }

    return expr;
  }

  private parseTerm(): AST.Expression {
    let expr = this.parsePrimary();

    while (!this.isEOF()) {
      const token = this.peek();
      if (
        token.type == TokenType.Operator &&
        (token.value == "+" || token.value == "-")
      ) {
        const operator = token.value;
        this.current++;
        const right = this.parsePrimary();
        expr = {
          type: "BinaryExpr",
          left: expr,
          operator: operator,
          right: right,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): AST.Expression {
    const token = this.peek();

    if (token.type == TokenType.Number) {
      this.current++;
      return {
        type: "NumberLiteral",
        value: Number(token.value),
      } as AST.NumberExpr;
    }

    if (token.type == TokenType.Identifier) {
      this.current++;
      return { type: "Identifier", name: token.value } as AST.IdentifierExpr;
    }

    if (token.type == TokenType.Punctuation && token.value == "(") {
      this.current++;
      const expr = this.parseExpression();
      this.expect(TokenType.Punctuation, "Ожидалась ')'", ")");
      return expr;
    }

    throw new Error(
      `Синтаксическая ошибка [строка ${token.line}]: Ожидалось выражение (число или переменная), но встречено '${token.value}'`,
    );
  }

  private parseWhileStatement(): AST.WhileStatement {
    this.current++;

    this.expect(TokenType.Punctuation, "Ожидалось '('", "(");

    const condition = this.parseExpression();

    this.expect(TokenType.Punctuation, "Ожидалось ')'", ")");

    this.expect(TokenType.Punctuation, "Ожидалось '{'", "{");
    const body: AST.Statement[] = [];

    while (this.peek().value != "}") {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.Punctuation, "Ожидалось '}'", "}");

    return {
      body,
      condition,
      type: "WhileStatement",
    };
  }

  private parseIfStatement(): AST.IfStatement {
    this.current++;
    this.expect(TokenType.Punctuation, "Ожидалось '('", "(");

    const condition = this.parseExpression();

    this.expect(TokenType.Punctuation, "Ожидалось ')'", ")");

    this.expect(TokenType.Punctuation, "Ожидалось '{'", "{");

    const consequent: AST.Statement[] = [];
    const alternate: AST.Statement[] = [];

    while (this.peek().value != "}") {
      consequent.push(this.parseStatement());
    }

    this.expect(TokenType.Punctuation, "Ожидалось '}'", "}");

    const next = this.peek();

    if (next.value == "иначе") {
      this.current++;
      this.expect(TokenType.Punctuation, "Ожидалось '{'", "{");

      while (this.peek().value != "}") {
        alternate.push(this.parseStatement());
      }

      this.expect(TokenType.Punctuation, "Ожидалось '}'", "}");
    }

    return {
      condition,
      type: "IfStatement",
      consequent,
      alternate,
    };
  }

  parseStatement(): AST.Statement {
    const token = this.peek();

    if (token.type == TokenType.Keyword) {
      if (token.value == "целое" || token.value == "матрица") {
        return this.parseVarDeclaration();
      }
      if (
        token.value == "ввод" ||
        token.value == "вывод" ||
        token.value == "сортировать"
      ) {
        return this.parseCallExpression();
      }
      if (token.value == "пока") {
        return this.parseWhileStatement();
      }
      if (token.value == "если") {
        return this.parseIfStatement();
      }
    }

    if (token.type == TokenType.Identifier) {
      return this.parseAssignment();
    }

    throw new Error(
      `Синтаксическая ошибка [строка ${token.line}]: Неизвестная инструкция '${token.value}'`,
    );
  }

  parse(): AST.Program {
    const program: AST.Program = { type: "Program", body: [] };

    while (!this.isEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }
}
