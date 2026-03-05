import collections
from dataclasses import dataclass, field
from typing import Dict, List, Set

Symbol = str
State = str

NondeterministicTransition = Dict[State, Dict[Symbol, List[State]]]
DeterministicTransition = Dict[State, Dict[Symbol, State]]

@dataclass
class NFAConfiguration:
    alphabet: Set[Symbol]
    initial_state: State
    final_states: Set[State]
    transitions: NondeterministicTransition
    states: Set[State] = field(default_factory=set)

@dataclass
class DFAConfiguration:
    states: Set[State]
    alphabet: Set[Symbol]
    initial_state: State
    final_states: Set[State]
    transitions: DeterministicTransition


class AutomataConverter:
    def __init__(self, nfa_config: NFAConfiguration):
        self.nfa_config = nfa_config

    def _merge_states(self, states: List[State]) -> State:
        unique_sorted_states = sorted(list(set(states)))
        return ",".join(unique_sorted_states)

    def _split_state(self, state: State) -> List[State]:
        if not state:
            return []
        return state.split(",")

    def determinize(self) -> DFAConfiguration:
        new_initial_state = self._merge_states([self.nfa_config.initial_state])

        new_transitions: DeterministicTransition = {}
        new_states: Set[State] = {new_initial_state}
        new_final_states: Set[State] = set()
        queue = collections.deque([new_initial_state])

        while queue:
            current_dfa_state = queue.popleft()
            new_transitions[current_dfa_state] = {}
            nfa_states = self._split_state(current_dfa_state)
            for symbol in self.nfa_config.alphabet:
                reachable_nfa_states: List[State] = []
                for nfa_state in nfa_states:
                    transitions_from_state = self.nfa_config.transitions.get(nfa_state, {})
                    next_states = transitions_from_state.get(symbol, [])
                    reachable_nfa_states.extend(next_states)

                merged_state = self._merge_states(reachable_nfa_states)
                new_transitions[current_dfa_state][symbol] = merged_state
                if merged_state and merged_state not in new_states:
                    new_states.add(merged_state)
                    queue.append(merged_state)

        for dfa_state in new_states:
            nfa_states_in_dfa_state = self._split_state(dfa_state)
            if any(s in self.nfa_config.final_states for s in nfa_states_in_dfa_state):
                new_final_states.add(dfa_state)

        return DFAConfiguration(
            alphabet=self.nfa_config.alphabet,
            final_states=new_final_states,
            transitions=new_transitions,
            states=new_states,
            initial_state=new_initial_state,
        )