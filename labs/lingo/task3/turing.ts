export type Direction = "L" | "R" | "N";

export interface TuringRule {
  write: string;
  move: Direction;
  next: string;
}

export type TuringProgram = Record<string, TuringRule>;

export class TuringMachine {
  tape: string[];
  head: number;
  state: string;
  program: TuringProgram;
  history: string[] = [];

  private readonly FINAL_STATE = "halt";

  constructor(initialTape: string, program: TuringProgram) {
    this.tape = initialTape.split("");
    this.head = 0;
    this.state = "q0";
    this.program = program;
  }

  get currentSymbol() {
    return this.tape[this.head] || "_";
  }

  step(): boolean {
    if (this.state == this.FINAL_STATE) return false;
    const key = `${this.state}:${this.currentSymbol}`;
    const rule = this.program[key];

    if (!rule) {
      this.state = this.FINAL_STATE;
      return false;
    }

    this.tape[this.head] = rule.write;
    if (rule.move == "L") {
      this.head--;
      if (this.head < 0) {
        this.tape.unshift("_");
        this.head = 0;
      }
    } else if (rule.move == "R") {
      this.head++;
      if (this.head >= this.tape.length) {
        this.tape.push("_");
      }
    }
    this.state = rule.next;

    return this.state != this.FINAL_STATE;
  }

  getTapeString() {
    return this.tape.join("");
  }
}
