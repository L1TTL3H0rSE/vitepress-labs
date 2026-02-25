import { StructureNode } from "./lab2_1";

//tail намеренно не использую
export class SinglyLinkedList<T> {
  head: StructureNode<T> | null = null;
  private _size: number = 0;

  //можно и без этого, но мне удобнее так
  private _is_empty() {
    return this._size == 0;
  }

  prepend(data: T) {
    const next = this.head;
    this.head = new StructureNode(data);
    this.head.next = next;
    this._size = this._size + 1;
  }

  append(data: T) {
    let current: StructureNode<T> | null = this.head;
    if (this._is_empty()) {
      this.prepend(data);
      return;
    }
    while (current!.next != null) {
      current = current!.next;
    }
    current!.next = new StructureNode(data);
    this._size = this._size + 1;
  }

  //я не знаю как это будет работать с объектами, так как они сравниваются по ссылкам
  //предположим, что мы пока что работаем только с примитивами
  find(data: T) {
    if (this._is_empty()) throw new Error("List is empty!");

    let index = 0;
    let node: StructureNode<T> | null = this.head!;

    while (!!node) {
      if (node.data == data) {
        return index;
      }
      node = node.next;
      index++;
    }

    return -1;
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
    let node: StructureNode<T> | null = this.head!;

    while (counter != index - 1) {
      node = node!.next;
      counter++;
    }

    const next = node!.next;
    node!.next = new StructureNode(data);
    node!.next.next = next;
    this._size = this._size + 1;
  }

  //не очень понятно, тут удалять только 1 или все случаи?
  remove(data: T) {
    if (this._is_empty()) return;

    let node: StructureNode<T> | null = null;
    let nextNode: StructureNode<T> | null = this.head!;

    while (!!nextNode) {
      if (nextNode.data == data) {
        const next = nextNode.next;
        this._size = this._size - 1;
        if (!node) {
          this.head = next;
          return;
        }
        node.next = next;
        return;
      }
      node = nextNode;
      nextNode = nextNode.next;
    }
  }

  //не очень понимаю, тут они выводятся по одному или всем скопом?
  //return для явного вывода, чтобы я мог это в верстке показать
  display() {
    if (this._is_empty()) {
      console.log("");
      return "null";
    }

    let node: StructureNode<T> | null = this.head;
    let nodes: T[] = [];

    while (!!node) {
      nodes.push(node.data);
      node = node.next;
    }

    const output = nodes.join(" -> ") + " -> null";
    console.log(output);
    return output;
  }
}
