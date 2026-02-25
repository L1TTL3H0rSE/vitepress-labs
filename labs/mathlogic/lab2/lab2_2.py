from typing import TypeVar, Generic, Optional
from lab2_1 import StructureNode

T = TypeVar('T')

class Queue(Generic[T]):
    def __init__(self):
        self.head: Optional[StructureNode[T]] = None
        self.tail: Optional[StructureNode[T]] = None
        self._size: int = 0

    def is_empty(self):
        return self._size == 0

    def size(self):
        return self._size

    def enqueue(self, data: T):
        node = StructureNode(data)
        if self.is_empty() == True:
            self.head = node
            self.tail = node
        elif self.is_empty() == False:
            self.tail.next = node
            self.tail = node
            
        self._size = self._size + 1

    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue is empty!")
        
        data = self.head.data
        self.head = self.head.next
        self._size = self._size - 1
        
        if self.is_empty():
            self.tail = None
            
        return data

    def peek(self):
        if self.is_empty():
            raise Exception("Queue is empty!")
        return self.head.data