export class StructureNode<T> {
  data: T;
  next: StructureNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class Stack<T> {
  top: StructureNode<T> | null = null;
  private _size: number = 0;

  is_empty() {
    return this._size == 0;
  }

  size() {
    return this._size;
  }

  push(data: T) {
    const next = this.top;
    this.top = new StructureNode(data);
    this.top.next = next;
    this._size = this._size + 1;
  }

  pop() {
    if (this.is_empty()) throw new Error("Stack is empty!");
    const popped = this.top!.data;

    this.top = this.top!.next;
    this._size = this._size - 1;

    return popped;
  }

  peek() {
    if (this.is_empty()) throw new Error("Stack is empty!");
    return this.top!.data;
  }
}
