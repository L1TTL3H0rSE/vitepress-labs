import * as AST from "./ast";

export class Translator {
  private ast: AST.Program;
  private output: string[] = [];
  private indentLevel: number = 0;

  constructor(ast: AST.Program) {
    this.ast = ast;
  }

  private indent(): string {
    return "  ".repeat(this.indentLevel);
  }

  public translate(): string {
    this.generateRuntime();
    for (const statement of this.ast.body) {
      this.output.push(this.indent() + this.visitNode(statement));
    }
    return this.output.join("\n");
  }

  private generateRuntime(): void {
    this.output.push(`// --- RUNTIME ENVIRONMENT ---`);
    this.output.push(`function __input(name) {`);
    this.output.push(`  let val = prompt("Введите значение для: " + name);`);
    this.output.push(`  return Number(val);`);
    this.output.push(`}`);
    this.output.push(`function __sortMatrix(matrix) {`);
    this.output.push(`  for (let i = 0; i < matrix.length; i++) {`);
    this.output.push(`    matrix[i].sort((a, b) => a - b);`);
    this.output.push(`  }`);
    this.output.push(`}`);
    this.output.push(`// --- COMPILED CODE ---`);
  }

  private visitNode(node: AST.Statement | AST.Expression): string {
    switch (node.type) {
      case "VarDeclaration":
        return this.visitVarDeclaration(node);
      case "Assignment":
        return this.visitAssignment(node);
      case "CallExpression":
        return this.visitCallExpression(node);
      case "WhileStatement":
        return this.visitWhileStatement(node);
      case "IfStatement":
        return this.visitIfStatement(node);
      case "BinaryExpr":
        return this.visitBinaryExpr(node);
      case "NumberLiteral":
        return this.visitNumberLiteral(node);
      case "Identifier":
        return this.visitIdentifier(node);
      default:
        throw new Error(
          `Транслятор не поддерживает узел типа: ${(node as any).type}`,
        );
    }
  }

  private visitNumberLiteral(node: AST.NumberExpr): string {
    return node.value.toString();
  }

  private visitIdentifier(node: AST.IdentifierExpr): string {
    return node.name;
  }

  private visitBinaryExpr(node: AST.BinaryExpr): string {
    const left = this.visitNode(node.left);
    const right = this.visitNode(node.right);
    return `(${left} ${node.operator} ${right})`;
  }

  private visitVarDeclaration(node: AST.VarDeclaration): string {
    if (node.dataType == "целое") return `let ${node.name} = 0;`;
    return `let ${node.name} = Array(${node.arraySize}).fill().map(() => Array(${node.arraySize}).fill(0));`;
  }

  private visitAssignment(node: AST.Assignment): string {
    const right = this.visitNode(node.value);
    return `${node.assignee} = ${right};`;
  }

  private visitCallExpression(node: AST.CallExpression): string {
    if (node.functionName == "вывод") {
      return `console.log(${node.argument});`;
    }
    if (node.functionName == "ввод") {
      return `${node.argument} = __input("${node.argument}");`;
    }
    if (node.functionName == "сортировать") {
      return `__sortMatrix(${node.argument});`;
    }
    throw new Error("not implemented");
  }

  private visitWhileStatement(node: AST.WhileStatement): string {
    const conditionStr = this.visitNode(node.condition);
    let result = `while ${conditionStr} {\n`;
    this.indentLevel++;
    for (const statement of node.body) {
      const stmtStr = this.visitNode(statement);
      result += this.indent() + stmtStr + "\n";
    }
    this.indentLevel--;
    result += this.indent() + `}`;
    return result;
  }

  private visitIfStatement(node: AST.IfStatement): string {
    const conditionStr = this.visitNode(node.condition);
    let result = `if ${conditionStr} {\n`;
    this.indentLevel++;
    for (const statement of node.consequent) {
      result += this.indent() + this.visitNode(statement) + "\n";
    }
    this.indentLevel--;
    if (node.alternate && node.alternate.length > 0) {
      result += this.indent() + `} else {\n`;
      this.indentLevel++;
      for (const statement of node.alternate) {
        result += this.indent() + this.visitNode(statement) + "\n";
      }
      this.indentLevel--;
    }
    result += this.indent() + `}`;
    return result;
  }
}
