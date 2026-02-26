from typing import TypeVar, Generic, List, Optional
import math

T = TypeVar('T')

class HeapElement(Generic[T]):
    def __init__(self, data: T, priority: int):
        self.data: T = data
        self.priority: int = priority

class MinHeap(Generic[T]):
    def __init__(self):
        self.heap: List[HeapElement[T]] = []

    def _sift_up(self, element: HeapElement[T], i: int):
        if i == 0:
            return
        
        index = (i - 1) // 2
        parent = self.heap[index]
        
        if element.priority < parent.priority:
            self.heap[i] = parent
            self.heap[index] = element
            self._sift_up(element, index)

    def _sift_down(self, element: HeapElement[T], i: int):
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left > len(self.heap) - 1:
            return

        left_child_p = self.heap[left].priority
        
        if right > len(self.heap) - 1:
            new_index = left
        else:
            right_child_p = self.heap[right].priority
            if right_child_p > left_child_p:
                new_index = left
            else:
                new_index = right

        if element.priority > self.heap[new_index].priority:
            self.heap[i] = self.heap[new_index]
            self.heap[new_index] = element
            return self._sift_down(element, new_index)
        
        return i

    def is_empty(self):
        return len(self.heap) == 0

    def push(self, data: T, priority: int):
        element = HeapElement(data, priority)
        self.heap.append(element)
        self._sift_up(element, len(self.heap) - 1)

    def pop(self):
        if len(self.heap) == 0:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()
        
        top = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._sift_down(self.heap[0], 0)
        
        return top

    def peek(self):
        if len(self.heap) > 0:
            return self.heap[0]
        return None

    def size(self):
        return len(self.heap)