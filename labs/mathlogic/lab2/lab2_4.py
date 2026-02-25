from typing import TypeVar, Generic, Optional, List

T = TypeVar('T')

class DoublyLinkedNode(Generic[T]):
    def __init__(self, data: T):
        self.data: T = data
        self.next: Optional['DoublyLinkedNode[T]'] = None
        self.prev: Optional['DoublyLinkedNode[T]'] = None

class DoublyLinkedList(Generic[T]):
    def __init__(self):
        self.head: Optional[DoublyLinkedNode[T]] = None
        self.tail: Optional[DoublyLinkedNode[T]] = None
        self._size: int = 0

    def _is_empty(self):
        return self._size == 0

    def prepend(self, data: T):
        node = DoublyLinkedNode(data)
        if self._is_empty() == True:
            self.head = node
            self.tail = node
        elif self._is_empty() == False:
            node.next = self.head
            self.head.prev = node
            self.head = node
            
        self._size = self._size + 1

    def append(self, data: T):
        node = DoublyLinkedNode(data)
        if self._is_empty() == True:
            self.head = node
            self.tail = node
        elif self._is_empty() == False:
            node.prev = self.tail
            self.tail.next = node
            self.tail = node
            
        self._size = self._size + 1

    def insert(self, data: T, index: int):
        if index <= 0 or self._is_empty():
            self.prepend(data)
            return
        if index >= self._size:
            self.append(data)
            return

        counter = 0
        node: Optional[DoublyLinkedNode[T]] = self.head

        while counter != index - 1:
            node = node.next
            counter += 1

        next_node = node.next
        new_node = DoublyLinkedNode(data)
        new_node.next = next_node
        new_node.prev = node
        node.next = new_node
        next_node.prev = new_node
        self._size = self._size + 1

    def remove(self, data: T):
        if self._is_empty():
            return

        node: Optional[DoublyLinkedNode[T]] = self.head

        while node is not None:
            if node.data == data:
                self._size = self._size - 1
                if not node.prev and not node.next:
                    self.head = None
                    self.tail = None
                    return
                if not node.prev:
                    self.head = node.next
                    self.head.prev = None
                    return
                if not node.next:
                    self.tail = node.prev
                    self.tail.next = None
                    return
                
                node.prev.next = node.next
                node.next.prev = node.prev
                return
            
            node = node.next

    def display_forward(self):
        if self._is_empty():
            print("")
            return "null"

        node: Optional[DoublyLinkedNode[T]] = self.head
        nodes: List[T] = []

        while node is not None:
            nodes.append(node.data)
            node = node.next

        output = "null -> " + " -> ".join(map(str, nodes)) + " -> null"
        print(output)
        return output

    def display_backward(self):
        if self._is_empty():
            print("")
            return "null"

        node: Optional[DoublyLinkedNode[T]] = self.tail
        nodes: List[T] = []

        while node is not None:
            nodes.append(node.data)
            node = node.prev

        output = "null <- " + " <- ".join(map(str, nodes)) + " <- null"
        print(output)
        return output