from typing import Dict, List, Set, Any

class ConverterAutomata:
    def __init__(self, config: Dict[str, Any]):
        self.alphabet: Set[str] = config["alphabet"]
        self.initial_state: str = config["initialState"]
        self.final_states: Set[str] = config["finalStates"]
        self.transitions: Dict[str, Dict[str, List[str]]] = config["transitions"]

    def _merge_states(self, states: List[str]) -> str:
        unique_states = sorted(list(set(states)))
        return ",".join(unique_states)

    def _split_state(self, state: str) -> List[str]:
        if not state:
            return []
        return state.split(",")

    def determinize(self) -> Dict[str, Any]:
        new_initial = self._merge_states([self.initial_state])
        new_transitions: Dict[str, Dict[str, str]] = {}
        new_states: Set[str] = {new_initial}
        new_final_states: Set[str] = set()
        queue: List[str] = [new_initial]

        while queue:
            state = queue.pop(0)
            sub_states = self._split_state(state)
            
            for char in self.alphabet:
                reachable_states =[]
                for sub_state in sub_states:
                    if sub_state in self.transitions and char in self.transitions[sub_state]:
                        reachable_states.extend(self.transitions[sub_state][char])
                
                merged = self._merge_states(reachable_states)
                
                if state not in new_transitions:
                    new_transitions[state] = {}
                new_transitions[state][char] = merged
                
                if merged not in new_states:
                    new_states.add(merged)
                    queue.append(merged)

        for state in new_states:
            sub_states = self._split_state(state)
            if any(s in self.final_states for s in sub_states):
                new_final_states.add(state)

        return {
            "alphabet": self.alphabet,
            "initialState": new_initial,
            "finalStates": new_final_states,
            "transitions": new_transitions,
            "states": new_states
        }