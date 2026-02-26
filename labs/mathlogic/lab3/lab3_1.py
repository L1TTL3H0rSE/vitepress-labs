from typing import Optional, List

class TreeNode:
    def __init__(self, data: int):
        self.data: int = data
        self.left: Optional['TreeNode'] = None
        self.right: Optional['TreeNode'] = None

class BinarySearchTree:
    def __init__(self):
        self.root: Optional[TreeNode] = None
        self._size: int = 0

    def _is_empty(self):
        return self._size == 0

    def _search_insert(self, key: int, node: TreeNode) -> TreeNode:
        if key < node.data:
            if node.left is None:
                return node
            return self._search_insert(key, node.left)
        if key > node.data:
            if node.right is None:
                return node
            return self._search_insert(key, node.right)
        return node

    def _direction_search(self, node: TreeNode, direction: str) -> TreeNode:
        if direction == "left":
            if node.left is None:
                return node
            return self._direction_search(node.left, direction)
        elif direction == "right":
            if node.right is None:
                return node
            return self._direction_search(node.right, direction)
        
        return node

    def _inorder(self, node: Optional[TreeNode], result: List[int]):
        if node is None:
            return
        self._inorder(node.left, result)
        result.append(node.data)
        self._inorder(node.right, result)

    def _preorder(self, node: Optional[TreeNode], result: List[int]):
        if node is None:
            return
        result.append(node.data)
        self._preorder(node.left, result)
        self._preorder(node.right, result)

    def _postorder(self, node: Optional[TreeNode], result: List[int]):
        if node is None:
            return
        self._postorder(node.left, result)
        self._postorder(node.right, result)
        result.append(node.data)

    def _delete_node(self, key: int, node: Optional[TreeNode]) -> Optional[TreeNode]:
        if node is None:
            return None
        
        if key < node.data:
            node.left = self._delete_node(key, node.left)
            return node
        
        if key > node.data:
            node.right = self._delete_node(key, node.right)
            return node
        
        if key == node.data:
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
            return node
            
        return None

    def insert(self, key: int):
        if self._is_empty():
            self.root = TreeNode(key)
            self._size += 1
            return

        node = self._search_insert(key, self.root)
        
        if key > node.data:
            node.right = TreeNode(key)
            self._size += 1
            return
        
        if key < node.data:
            node.left = TreeNode(key)
            self._size += 1
            return

    def find(self, key: int) -> Optional[TreeNode]:
        if self._is_empty():
            return None
        
        node = self._search_insert(key, self.root)
        if node.data != key:
            return None
        return node

    def min(self):
        if self._is_empty():
            raise Exception("Tree is empty!")
        return self._direction_search(self.root, "left")

    def max(self):
        if self._is_empty():
            raise Exception("Tree is empty!")
        return self._direction_search(self.root, "right")

    def traverse_inorder(self):
        result: List[int] = []
        if self._is_empty():
            return result
        self._inorder(self.root, result)
        return result

    def traverse_preorder(self):
        result: List[int] = []
        if self._is_empty():
            return result
        self._preorder(self.root, result)
        return result

    def traverse_postorder(self):
        result: List[int] = []
        if self._is_empty():
            return result
        self._postorder(self.root, result)
        return result

    def delete(self, key: int):
        if self._is_empty():
            raise Exception("Tree is empty!")
        self.root = self._delete_node(key, self.root)