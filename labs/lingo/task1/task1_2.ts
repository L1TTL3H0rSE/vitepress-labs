export type Symbol = string;
export type State = string;

export type NondeterministicTransition = Record<State, Record<Symbol, State[]>>;
export type DetermenisticTransition = Record<State, Record<Symbol, State>>;

export type ConverterAutomataConfiguration<T> = {
  states: Set<State>;
  alphabet: Set<Symbol>;
  initialState: State;
  finalStates: Set<State>;
  transitions: T;
};

export const EPSILON = "ε";

export class ConverterAutomata {
  configuration: ConverterAutomataConfiguration<NondeterministicTransition>;

  constructor(
    config: Omit<
      ConverterAutomataConfiguration<NondeterministicTransition>,
      "states"
    >,
  ) {
    this.configuration = { ...config, states: new Set<State>() };
  }

  private _mergeStates(states: State[]): State {
    return [...new Set(states.sort())].join(",");
  }

  private _splitState(state: State): State[] {
    if (!state) return [];
    return state.split(",");
  }

  private _getEpsilonClosure(states: State[]): State[] {
    const closure = new Set<State>(states);
    const queue = [...states];

    while (queue.length > 0) {
      const currentState = queue.shift()!;
      const epsilonTransitions =
        this.configuration.transitions[currentState]?.[EPSILON] || [];

      for (const nextState of epsilonTransitions) {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          queue.push(nextState);
        }
      }
    }
    return Array.from(closure).sort();
  }

  determinize(): ConverterAutomataConfiguration<DetermenisticTransition> {
    const initialClosure = this._getEpsilonClosure([
      this.configuration.initialState,
    ]);
    const newInitial = this._mergeStates(initialClosure);

    const newTransitions: DetermenisticTransition = {};
    const newStates: Set<State> = new Set([newInitial]);
    const newFinalStates: Set<State> = new Set();
    const queue: State[] = [newInitial];

    while (queue.length > 0) {
      const state = queue.shift()!;
      const states = this._splitState(state);

      this.configuration.alphabet.forEach((e) => {
        if (e == EPSILON) return;

        const reachableStates: State[] = [];

        states.forEach((j) => {
          const transition = this.configuration.transitions[j]?.[e];
          if (!!transition) {
            reachableStates.push(...transition);
          }
        });

        const closureAfterTransition = this._getEpsilonClosure(reachableStates);
        const merged = this._mergeStates(closureAfterTransition);

        if (!newTransitions[state]) newTransitions[state] = {};
        newTransitions[state][e] = merged;

        if (!newStates.has(merged)) {
          newStates.add(merged);
          queue.push(merged);
        }
      });
    }

    newStates.forEach((e) => {
      if (
        this._splitState(e).some((j) => this.configuration.finalStates.has(j))
      ) {
        newFinalStates.add(e);
      }
    });

    const finalAlphabet = new Set(this.configuration.alphabet);
    finalAlphabet.delete(EPSILON);

    return {
      alphabet: finalAlphabet,
      finalStates: newFinalStates,
      transitions: newTransitions,
      states: newStates,
      initialState: newInitial,
    };
  }
}
