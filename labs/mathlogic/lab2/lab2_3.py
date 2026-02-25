from typing import TypeVar, Generic, Optional, List
from lab2_1 import StructureNode

T = TypeVar('T')

class SinglyLinkedList(Generic[T]):
    def __init__(self):
        self.head: Optional[StructureNode[T]] = None
        self._size: int = 0

    # можно и без этого, но мне удобнее так
    def _is_empty(self):
        return self._size == 0

    def prepend(self, data: T):
        next_node = self.head
        self.head = StructureNode(data)
        self.head.next = next_node
        self._size = self._size + 1

    def append(self, data: T):
        current: Optional[StructureNode[T]] = self.head
        if self._is_empty():
            self.prepend(data)
            return
        
        while current.next is not None:
            current = current.next
        
        current.next = StructureNode(data)
        self._size = self._size + 1

    # я не знаю как это будет работать с объектами, так как они сравниваются по ссылкам
    # предположим, что мы пока что работаем только с примитивами
    def find(self, data: T):
        if self._is_empty():
            raise Exception("List is empty!")

        index = 0
        node: Optional[StructureNode[T]] = self.head

        while node is not None:
            if node.data == data:
                return index
            node = node.next
            index += 1

        return -1

    def insert(self, data: T, index: int):
        if index <= 0 or self._is_empty():
            self.prepend(data)
            return
        if index >= self._size:
            self.append(data)
            return
        
        counter = 0
        node: Optional[StructureNode[T]] = self.head

        while counter != index - 1:
            node = node.next
            counter += 1

        next_node = node.next
        node.next = StructureNode(data)
        node.next.next = next_node
        self._size = self._size + 1

    # не очень понятно, тут удалять только 1 или все случаи?
    def remove(self, data: T):
        if self._is_empty():
            return

        node: Optional[StructureNode[T]] = None
        next_node: Optional[StructureNode[T]] = self.head

        while next_node is not None:
            if next_node.data == data:
                next_ref = next_node.next
                self._size = self._size - 1
                if node is None:
                    self.head = next_ref
                    return
                node.next = next_ref
                return
            node = next_node
            next_node = next_node.next

    # не очень понимаю, тут они выводятся по одному или всем скопом?
    # return для явного вывода, чтобы я мог это в верстке показать
    def display(self):
        if self._is_empty():
            print("")
            return "null"

        node: Optional[StructureNode[T]] = self.head
        nodes: List[T] = []

        while node is not None:
            nodes.append(node.data)
            node = node.next

        output = " -> ".join(map(str, nodes)) + " -> null"
        print(output)
        return output