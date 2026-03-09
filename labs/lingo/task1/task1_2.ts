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
    return state.split(",");
  }

  determinize(): ConverterAutomataConfiguration<DetermenisticTransition> {
    const newInitial = this._mergeStates([this.configuration.initialState]);
    const newTransitions: DetermenisticTransition = {};
    const newStates: Set<State> = new Set([newInitial]);
    const newFinalStates: Set<State> = new Set();
    const queue: State[] = [newInitial];

    while (queue.length > 0) {
      const state = queue.shift()!;
      const states = this._splitState(state);
      this.configuration.alphabet.forEach((e) => {
        const reachableStates: State[] = [];
        states.forEach((j) => {
          const transition = this.configuration.transitions[j]?.[e];
          if (!!transition) {
            reachableStates.push(...transition);
          }
        });
        const merged = this._mergeStates(reachableStates);
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
      )
        newFinalStates.add(e);
    });

    return {
      alphabet: this.configuration.alphabet,
      finalStates: newFinalStates,
      transitions: newTransitions,
      states: newStates,
      initialState: newInitial,
    };
  }
}
