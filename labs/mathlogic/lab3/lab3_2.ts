export class HeapElement<T> {
  data: T;
  priority: number;

  constructor(data: T, priority: number) {
    this.data = data;
    this.priority = priority;
  }
}

export class MinHeap<T> {
  heap: HeapElement<T>[] = [];

  private _siftUp(element: HeapElement<T>, i: number) {
    if (i == 0) return;
    const index = Math.floor((i - 1) / 2);
    const parent = this.heap[index];
    if (element.priority < parent.priority) {
      this.heap[i] = parent;
      this.heap[index] = element;
      this._siftUp(element, index);
    }
  }

  private _siftDown(element: HeapElement<T>, i: number) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left > this.heap.length - 1) return;
    const leftChild = this.heap[left].priority;
    const rightChild = this.heap[right]?.priority;
    const newIndex =
      right > this.heap.length - 1
        ? left
        : rightChild > leftChild
          ? left
          : right;
    if (element.priority > this.heap[newIndex].priority) {
      this.heap[i] = this.heap[newIndex];
      this.heap[newIndex] = element;
      return this._siftDown(element, newIndex);
    }
    return i;
  }

  is_empty() {
    return this.heap.length == 0;
  }

  push(data: T, priority: number) {
    const element = new HeapElement(data, priority);
    this.heap.push(element);
    this._siftUp(element, this.heap.length - 1);
  }

  pop() {
    if (this.heap.length == 0) return null;
    if (this.heap.length == 1) {
      return this.heap.pop()!;
    }
    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this._siftDown(this.heap[0], 0);
    return top;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
