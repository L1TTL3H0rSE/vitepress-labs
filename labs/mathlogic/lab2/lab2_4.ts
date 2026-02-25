export class DoublyLinkedNode<T> {
  data: T;
  next: DoublyLinkedNode<T> | null = null;
  prev: DoublyLinkedNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> {
  head: DoublyLinkedNode<T> | null = null;
  tail: DoublyLinkedNode<T> | null = null;
  private _size: number = 0;

  private _is_empty() {
    return this._size == 0;
  }

  prepend(data: T) {
    const node = new DoublyLinkedNode(data);
    switch (this._is_empty()) {
      case true:
        this.head = node;
        this.tail = node;
        break;
      case false: {
        node.next = this.head;
        this.head!.prev = node;
        this.head = node;
        break;
      }
    }
    this._size = this._size + 1;
  }

  append(data: T) {
    const node = new DoublyLinkedNode(data);
    switch (this._is_empty()) {
      case true:
        this.head = node;
        this.tail = node;
        break;
      case false:
        node.prev = this.tail;
        this.tail!.next = node;
        this.tail = node;
        break;
    }
    this._size = this._size + 1;
  }

  insert(data: T, index: number) {
    if (index <= 0 || this._is_empty()) {
      this.prepend(data);
      return;
    }
    if (index >= this._size) {
      this.append(data);
      return;
    }

    let counter = 0;
    let node: DoublyLinkedNode<T> | null = this.head!;

    while (counter != index - 1) {
      node = node!.next;
      counter++;
    }

    const next = node!.next!;
    const newNode = new DoublyLinkedNode(data);
    newNode.next = next;
    newNode.prev = node;
    node!.next = newNode;
    next.prev = newNode;
    this._size = this._size + 1;
  }

  remove(data: T) {
    if (this._is_empty()) return;

    let node: DoublyLinkedNode<T> | null = this.head;

    while (!!node) {
      if (node.data == data) {
        this._size = this._size - 1;
        if (!node.prev && !node.next) {
          this.head = null;
          this.tail = null;
          return;
        }
        if (!node.prev) {
          this.head = node.next!;
          this.head.prev = null;
          return;
        }
        if (!node.next) {
          this.tail = node.prev;
          this.tail.next = null;
          return;
        }
        node.prev.next = node.next;
        node.next.prev = node.prev;
        return;
      }
    }
    node = node!.next;
  }

  display_forward() {
    if (this._is_empty()) {
      console.log("");
      return "null";
    }

    let node: DoublyLinkedNode<T> | null = this.head;
    let nodes: T[] = [];

    while (!!node) {
      nodes.push(node.data);
      node = node.next;
    }

    const output = "null -> " + nodes.join(" -> ") + " -> null";
    console.log(output);
    return output;
  }

  display_backward() {
    if (this._is_empty()) {
      console.log("");
      return "null";
    }

    let node: DoublyLinkedNode<T> | null = this.tail;
    let nodes: T[] = [];

    while (!!node) {
      nodes.push(node.data);
      node = node.prev;
    }

    const output = "null <- " + nodes.join(" <- ") + " <- null";
    console.log(output);
    return output;
  }
}
