from typing import Optional, List

class AVLTreeNode:
    def __init__(self, data: int):
        self.data: int = data
        self.height: int = 1
        self.left: Optional['AVLTreeNode'] = None
        self.right: Optional['AVLTreeNode'] = None

class AVLTree:
    def __init__(self):
        self.root: Optional[AVLTreeNode] = None
        self._size: int = 0

    def _is_empty(self):
        return self._size == 0

    def _search(self, key: int, node: AVLTreeNode) -> AVLTreeNode:
        if key < node.data:
            if node.left is None:
                return node
            return self._search(key, node.left)
        if key > node.data:
            if node.right is None:
                return node
            return self._search(key, node.right)
        return node

    def _direction_search(self, node: AVLTreeNode, direction: str) -> AVLTreeNode:
        if direction == "left":
            if node.left is None:
                return node
            return self._direction_search(node.left, direction)
        elif direction == "right":
            if node.right is None:
                return node
            return self._direction_search(node.right, direction)
        return node

    def _inorder(self, node: Optional[AVLTreeNode], result: List[int]):
        if node is None:
            return
        self._inorder(node.left, result)
        result.append(node.data)
        self._inorder(node.right, result)

    def _insert_node(self, key: int, node: Optional[AVLTreeNode]) -> AVLTreeNode:
        if node is None:
            self._size += 1
            return AVLTreeNode(key)

        if key < node.data:
            node.left = self._insert_node(key, node.left)
        if key > node.data:
            node.right = self._insert_node(key, node.right)
        if key == node.data:
            return node

        node.height = 1 + max(self.height(node.left), self.height(node.right))
        balance = self.balance_factor(node)

        if balance > 1 and key < node.left.data:
            return self.rotate_right(node)
        
        if balance < -1 and key > node.right.data:
            return self.rotate_left(node)
        
        if balance > 1 and key > node.left.data:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        
        if balance < -1 and key < node.right.data:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    def _delete_node(self, key: int, node: Optional[AVLTreeNode]) -> Optional[AVLTreeNode]:
        if node is None:
            return None

        if key < node.data:
            node.left = self._delete_node(key, node.left)
        elif key > node.data:
            node.right = self._delete_node(key, node.right)
        elif key == node.data:
            if node.left is None and node.right is None:
                self._size -= 1
                return None
            if node.left is None and node.right is not None:
                self._size -= 1
                return node.right
            if node.left is not None and node.right is None:
                self._size -= 1
                return node.left
            
            temp = self._direction_search(node.right, "left")
            node.data = temp.data
            node.right = self._delete_node(temp.data, node.right)

        node.height = 1 + max(self.height(node.left), self.height(node.right))
        balance = self.balance_factor(node)

        if balance > 1 and self.balance_factor(node.left) >= 0:
            return self.rotate_right(node)
        
        if balance > 1 and self.balance_factor(node.left) < 0:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        
        if balance < -1 and self.balance_factor(node.right) <= 0:
            return self.rotate_left(node)
        
        if balance < -1 and self.balance_factor(node.right) > 0:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    def height(self, node: Optional[AVLTreeNode]) -> int:
        if node is None:
            return 0
        return node.height

    def balance_factor(self, node: Optional[AVLTreeNode]) -> int:
        if node is None:
            return 0
        return self.height(node.left) - self.height(node.right)

    def rotate_right(self, node: AVLTreeNode) -> AVLTreeNode:
        left_child = node.left
        right_of_left_child = left_child.right

        left_child.right = node
        node.left = right_of_left_child

        node.height = 1 + max(self.height(node.left), self.height(node.right))
        left_child.height = 1 + max(self.height(left_child.left), self.height(left_child.right))

        return left_child

    def rotate_left(self, node: AVLTreeNode) -> AVLTreeNode:
        right_child = node.right
        left_of_right_child = right_child.left

        right_child.left = node
        node.right = left_of_right_child

        node.height = 1 + max(self.height(node.left), self.height(node.right))
        right_child.height = 1 + max(self.height(right_child.left), self.height(right_child.right))

        return right_child

    def insert(self, key: int):
        self.root = self._insert_node(key, self.root)

    def delete(self, key: int):
        if self._is_empty():
            raise Exception("Tree is empty!")
        self.root = self._delete_node(key, self.root)

    def find(self, key: int) -> Optional[AVLTreeNode]:
        if self._is_empty():
            return None
        node = self._search(key, self.root)
        if node.data != key:
            return None
        return node

    def traverse_inorder(self):
        result: List[int] = []
        if self._is_empty():
            return result
        self._inorder(self.root, result)
        return result