export class AVLTreeNode {
  data: number;
  height: number = 1;
  left: AVLTreeNode | null = null;
  right: AVLTreeNode | null = null;

  constructor(data: number) {
    this.data = data;
  }
}

export class AVLTree {
  root: AVLTreeNode | null = null;
  private _size: number = 0;

  private _is_empty() {
    return this._size == 0;
  }

  private _search(key: number, node: AVLTreeNode): AVLTreeNode {
    if (key < node.data) {
      if (!node.left) {
        return node;
      }
      return this._search(key, node.left);
    }
    if (key > node.data) {
      if (!node.right) {
        return node;
      }
      return this._search(key, node.right);
    }
    return node;
  }

  private _directionSearch(node: AVLTreeNode, direction: "left" | "right") {
    switch (direction) {
      case "left":
        if (!node.left) return node;
        return this._directionSearch(node.left, direction);
      case "right":
        if (!node.right) return node;
        return this._directionSearch(node.right, direction);
    }
  }

  private _inorder(node: AVLTreeNode | null, result: number[]) {
    if (!node) return;
    this._inorder(node.left, result);
    result.push(node.data);
    this._inorder(node.right, result);
  }

  private _insertNode(key: number, node: AVLTreeNode | null): AVLTreeNode {
    if (!node) {
      this._size++;
      return new AVLTreeNode(key);
    }

    if (key < node.data) {
      node.left = this._insertNode(key, node.left);
    }
    if (key > node.data) {
      node.right = this._insertNode(key, node.right);
    }
    if (key == node.data) {
      return node;
    }

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.balance_factor(node);

    if (balance > 1 && key < node.left!.data) {
      return this.rotate_right(node);
    }
    if (balance < -1 && key > node.right!.data) {
      return this.rotate_left(node);
    }
    if (balance > 1 && key > node.left!.data) {
      node.left = this.rotate_left(node.left!);
      return this.rotate_right(node);
    }
    if (balance < -1 && key < node.right!.data) {
      node.right = this.rotate_right(node.right!);
      return this.rotate_left(node);
    }

    return node;
  }

  private _deleteNode(
    key: number,
    node: AVLTreeNode | null,
  ): AVLTreeNode | null {
    if (!node) return null;

    if (key < node.data) {
      node.left = this._deleteNode(key, node.left);
    }
    if (key > node.data) {
      node.right = this._deleteNode(key, node.right);
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
    }

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.balance_factor(node);

    if (balance > 1 && this.balance_factor(node.left) >= 0) {
      return this.rotate_right(node);
    }
    if (balance > 1 && this.balance_factor(node.left) < 0) {
      node.left = this.rotate_left(node.left!);
      return this.rotate_right(node);
    }
    if (balance < -1 && this.balance_factor(node.right) <= 0) {
      return this.rotate_left(node);
    }
    if (balance < -1 && this.balance_factor(node.right) > 0) {
      node.right = this.rotate_right(node.right!);
      return this.rotate_left(node);
    }

    return node;
  }

  height(node: AVLTreeNode | null): number {
    if (!node) return 0;
    return node.height;
  }

  balance_factor(node: AVLTreeNode | null): number {
    if (!node) return 0;
    return this.height(node.left) - this.height(node.right);
  }

  rotate_right(node: AVLTreeNode): AVLTreeNode {
    const leftChild = node.left!;
    const rightOfLeftChild = leftChild.right;

    leftChild.right = node;
    node.left = rightOfLeftChild;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    leftChild.height =
      1 + Math.max(this.height(leftChild.left), this.height(leftChild.right));

    return leftChild;
  }

  rotate_left(node: AVLTreeNode): AVLTreeNode {
    const rightChild = node.right!;
    const leftOfRightChild = rightChild.left;

    rightChild.left = node;
    node.right = leftOfRightChild;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    rightChild.height =
      1 + Math.max(this.height(rightChild.left), this.height(rightChild.right));

    return rightChild;
  }

  insert(key: number) {
    this.root = this._insertNode(key, this.root);
  }

  delete(key: number) {
    if (this._is_empty()) {
      throw new Error("Tree is empty!");
    }
    this.root = this._deleteNode(key, this.root);
  }

  find(key: number): AVLTreeNode | null {
    if (this._is_empty()) {
      return null;
    }
    const node = this._search(key, this.root!);
    if (node.data != key) return null;
    return node;
  }

  traverse_inorder() {
    const result: number[] = [];
    if (this._is_empty()) {
      return result;
    }
    this._inorder(this.root, result);
    return result;
  }
}
