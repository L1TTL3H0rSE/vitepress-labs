import { StructureNode } from "./lab2_1";

export class Queue<T> {
  head: StructureNode<T> | null = null;
  tail: StructureNode<T> | null = null;
  private _size: number = 0;

  is_empty() {
    return this._size == 0;
  }

  size() {
    return this._size;
  }

  enqueue(data: T) {
    const node = new StructureNode(data);
    switch (this.is_empty()) {
      case true:
        this.head = node;
        this.tail = node;
        break;
      case false:
        this.tail!.next = node;
        this.tail = node;
        break;
    }
    this._size = this._size + 1;
  }

  dequeue() {
    if (this.is_empty()) throw new Error("Queue is empty!");
    const data = this.head!.data;
    this.head = this.head!.next;
    this._size = this._size - 1;
    if (this.is_empty()) this.tail = null;
    return data;
  }

  peek() {
    if (this.is_empty()) throw new Error("Queue is empty!");
    return this.head!.data;
  }
}
