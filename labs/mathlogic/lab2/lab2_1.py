from typing import TypeVar, Generic, Optional

T = TypeVar('T')

class StructureNode(Generic[T]):
    def __init__(self, data: T):
        self.data: T = data
        self.next: Optional['StructureNode[T]'] = None

class Stack(Generic[T]):
    def __init__(self):
        self.top: Optional[StructureNode[T]] = None
        self._size: int = 0

    def is_empty(self):
        return self._size == 0

    def size(self):
        return self._size

    def push(self, data: T):
        next_node = self.top
        self.top = StructureNode(data)
        self.top.next = next_node
        self._size = self._size + 1

    def pop(self):
        if self.is_empty():
            raise Exception("Stack is empty!")
        
        popped = self.top.data

        self.top = self.top.next
        self._size = self._size - 1

        return popped

    def peek(self):
        if self.is_empty():
            raise Exception("Stack is empty!")
        return self.top.data
    
def reverse_words(sentence: str) -> str:
    stack = Stack[str]()
    for word in sentence.split():
        stack.push(word)
    
    reversed_sentence =[]
    while not stack.is_empty():
        reversed_sentence.append(stack.pop())
        
    return " ".join(reversed_sentence)