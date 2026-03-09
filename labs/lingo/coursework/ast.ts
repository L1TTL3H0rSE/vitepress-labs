export type Statement =
  | VarDeclaration
  | Assignment
  | CallExpression
  | WhileStatement
  | IfStatement;

export type Expression = IdentifierExpr | NumberExpr | BinaryExpr;

export interface VarDeclaration {
  type: "VarDeclaration";
  dataType: "целое" | "матрица";
  name: string;
  arraySize?: number;
}

export interface Assignment {
  type: "Assignment";
  assignee: string;
  value: Expression;
}

export interface CallExpression {
  type: "CallExpression";
  functionName: string;
  argument: string;
}

export interface WhileStatement {
  type: "WhileStatement";
  condition: Expression;
  body: Statement[];
}

export interface IfStatement {
  type: "IfStatement";
  condition: Expression;
  consequent: Statement[];
  alternate: Statement[];
}

export interface IdentifierExpr {
  type: "Identifier";
  name: string;
}

export interface NumberExpr {
  type: "NumberLiteral";
  value: number;
}

export interface BinaryExpr {
  type: "BinaryExpr";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface Program {
  type: "Program";
  body: Statement[];
}
