import { TuringProgram } from "./turing";

export const PROGRAM_ADDITION: TuringProgram = {
  "q0:X": { write: "X", move: "R", next: "q0" },
  "q0:_": { write: "_", move: "R", next: "q1" },
  "q1:X": { write: "X", move: "R", next: "q1" },
  "q1:_": { write: "_", move: "L", next: "q2" },
  "q2:X": { write: "_", move: "L", next: "q3" },
  "q3:X": { write: "X", move: "L", next: "q3" },
  "q3:_": { write: "X", move: "N", next: "halt" },
};

export const PROGRAM_SUBTRACTION: TuringProgram = {
  "q0:X": { write: "X", move: "R", next: "q0" },
  "q0:_": { write: "_", move: "R", next: "q1" },
  "q1:X": { write: "X", move: "R", next: "q1" },
  "q1:_": { write: "_", move: "L", next: "q2" },
  "q2:X": { write: "_", move: "L", next: "q3" },
  "q2:_": { write: "_", move: "L", next: "halt" },
  "q3:X": { write: "X", move: "L", next: "q3" },
  "q3:_": { write: "_", move: "L", next: "q4" },
  "q4:_": { write: "_", move: "L", next: "q4" },
  "q4:X": { write: "X", move: "R", next: "q5" },
  "q5:X": { write: "_", move: "R", next: "q0" },
  "q5:_": { write: "_", move: "L", next: "q2" },
};

export const PROGRAM_COPY: TuringProgram = {
  "q0:X": { write: "c", move: "R", next: "q1" },
  "q0:_": { write: "_", move: "L", next: "q_restore" },
  "q1:X": { write: "X", move: "R", next: "q1" },
  "q1:_": { write: "_", move: "R", next: "q2" },
  "q2:X": { write: "X", move: "R", next: "q2" },
  "q2:_": { write: "X", move: "L", next: "q3" },
  "q3:X": { write: "X", move: "L", next: "q3" },
  "q3:_": { write: "_", move: "L", next: "q4" },
  "q4:X": { write: "X", move: "L", next: "q4" },
  "q4:c": { write: "c", move: "R", next: "q0" },
  "q_restore:c": { write: "X", move: "L", next: "q_restore" },
  "q_restore:_": { write: "_", move: "R", next: "halt" },
  "q_restore:X": { write: "X", move: "L", next: "q_restore" },
};
