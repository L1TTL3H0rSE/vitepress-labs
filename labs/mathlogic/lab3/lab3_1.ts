export class TreeNode {
  data: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(data: number) {
    this.data = data;
  }
}

export class BinarySearchTree {
  root: TreeNode | null = null;
  private _size: number = 0;

  private _is_empty() {
    return this._size == 0;
  }

  private _searchInsert(key: number, node: TreeNode) {
    if (key < node.data) {
      if (!node.left) {
        return node;
      }
      return this._searchInsert(key, node.left);
    }
    if (key > node.data) {
      if (!node.right) {
        return node;
      }
      return this._searchInsert(key, node.right);
    }
    return node;
  }

  private _directionSearch(node: TreeNode, direction: "left" | "right") {
    switch (direction) {
      case "left":
        if (!node.left) return node;
        return this._directionSearch(node.left, direction);
      case "right":
        if (!node.right) return node;
        return this._directionSearch(node.right, direction);
    }
  }

  private _inorder(node: TreeNode | null, result: number[]) {
    if (!node) return;
    this._inorder(node.left, result);
    result.push(node.data);
    this._inorder(node.right, result);
  }

  private _preorder(node: TreeNode | null, result: number[]) {
    if (!node) return;
    result.push(node.data);
    this._preorder(node.left, result);
    this._preorder(node.right, result);
  }

  private _postorder(node: TreeNode | null, result: number[]) {
    if (!node) return;
    this._postorder(node.left, result);
    this._postorder(node.right, result);
    result.push(node.data);
  }

  private _deleteNode(key: number, node: TreeNode | null): TreeNode | null {
    if (!node) return null;
    if (key < node.data) {
      node.left = this._deleteNode(key, node.left);
      return node;
    }
    if (key > node.data) {
      node.right = this._deleteNode(key, node.right);
      return node;
    }
    if (key == node.data) {
      if (!node.left && !node.right) {
        this._size--;
        return null;
      }
      if (!node.left && !!node.right) {
        this._size--;
        return node.right;
      }
      if (!!node.left && !node.right) {
        this._size--;
        return node.left;
      }
      const temp = this._directionSearch(node.right, "left");
      node.data = temp.data;
      node.right = this._deleteNode(temp.data, node.right);
      return node;
    }
  }

  insert(key: number) {
    if (this._is_empty()) {
      this.root = new TreeNode(key);
      this._size++;
      return;
    }
    const node = this._searchInsert(key, this.root);
    if (key > node.data) {
      node.right = new TreeNode(key);
      this._size++;
      return;
    }
    if (key < node.data) {
      node.left = new TreeNode(key);
      this._size++;
      return;
    }
  }

  find(key: number): TreeNode | null {
    if (this._is_empty()) {
      return null;
    }
    const node = this._searchInsert(key, this.root);
    if (node.data != key) return null;
    return node;
  }

  min() {
    if (this._is_empty()) {
      throw new Error("Tree is empty!");
    }
    return this._directionSearch(this.root, "left");
  }

  max() {
    if (this._is_empty()) {
      throw new Error("Tree is empty!");
    }
    return this._directionSearch(this.root, "right");
  }

  traverse_inorder() {
    const result: number[] = [];
    if (this._is_empty()) {
      return result;
    }
    this._inorder(this.root, result);
    return result;
  }

  traverse_preorder() {
    const result: number[] = [];
    if (this._is_empty()) {
      return result;
    }
    this._preorder(this.root, result);
    return result;
  }

  traverse_postorder() {
    const result: number[] = [];
    if (this._is_empty()) {
      return result;
    }
    this._postorder(this.root, result);
    return result;
  }

  delete(key: number) {
    if (this._is_empty()) {
      throw new Error("Tree is empty!");
    }
    this.root = this._deleteNode(key, this.root);
  }
}
