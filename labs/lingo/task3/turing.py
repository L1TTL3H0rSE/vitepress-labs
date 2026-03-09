from typing import Dict, List, Literal, TypedDict

Direction = Literal["L", "R", "N"]

class TuringRule(TypedDict):
    write: str
    move: Direction
    next: str

TuringProgram = Dict[str, TuringRule]

class TuringMachine:
    FINAL_STATE = "halt"

    def __init__(self, initial_tape: str, program: TuringProgram):
        self.tape: List[str] = list(initial_tape)
        self.head: int = 0
        self.state: str = "q0"
        self.program: TuringProgram = program
        self.history: List[str] =[]

    @property
    def current_symbol(self) -> str:
        if 0 <= self.head < len(self.tape):
            return self.tape[self.head]
        return "_"

    def step(self) -> bool:
        if self.state == self.FINAL_STATE:
            return False
            
        key = f"{self.state}:{self.current_symbol}"
        rule = self.program.get(key)

        if not rule:
            self.state = self.FINAL_STATE
            return False