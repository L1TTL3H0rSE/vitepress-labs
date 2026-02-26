---
title: Лабораторная работа №3
description: Реализация деревьев поиска и приоритетных очередей.
head:
  - - meta
    - name: keywords
      content: typescript, bst, avl, heap, tree
---

<script setup lang="ts">
import ClassRunner from '../../components/ClassRunner.vue'
import InteractiveRunner, { InteractiveRunnerProps } from '../../components/InteractiveRunner.vue'

import { BinarySearchTree } from './lab3/lab3_1'
import { MinHeap } from './lab3/lab3_2'
import { AVLTree } from './lab3/lab3_3'

// Инстансы для демонстрации структуры
const bst = new BinarySearchTree()
const heap = new MinHeap()
const avl = new AVLTree()

// --- Логика для Heap Sort (Практическое задание №2) ---
function heapSort(nums: number[]) {
  const _heap = new MinHeap<number>();
  // Используем значение как приоритет для сортировки
  nums.forEach((n) => _heap.push(n, n));
  
  const sorted: number[] = [];
  while (!_heap.is_empty()) {
    // pop возвращает элемент с наименьшим приоритетом
    const item = _heap.pop();
    if (item) sorted.push(item.data);
  }
  return sorted;
}

function numberArrayMapper(input: string) {
    if (!input.trim()) throw new Error("Введите числа!");
    return input.trim().split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
}

const heapSortProps: InteractiveRunnerProps<number[]> = {
  solution: heapSort,
  mapper: numberArrayMapper,
  inputProps: {
    label: "Введите массив чисел",
    placeholder: "Например: 5, 2, 9, 1, 5, 6",
  }
};
</script>

# Лабораторная работа №3. Продвинутые структуры данных

**Цель:** Реализовать и изучить принципы работы деревьев поиска (обычных и самобалансирующихся), а также приоритетных очередей.

## 1. Бинарное дерево поиска (BST)

Бинарное дерево поиска — это структура данных, где у каждого узла есть не более двух потомков. Для любого узла выполняется правило: значения в левом поддереве меньше значения узла, а значения в правом — больше.

**Интерфейс:**
* `insert(key)` — вставить элемент
* `find(key)` — найти элемент
* `delete(key)` — удалить элемент
* `traverse_inorder()` — симметричный обход (возвращает отсортированный массив)
* `min() / max()` — минимальное и максимальное значение

**Задание:** Реализовать BST и продемонстрировать вывод элементов в порядке возрастания (inorder traversal).

<ClassRunner :instance="bst" title="Демонстрация: BST" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab3/lab3_1.ts
:::

## 2. Куча (Min-Heap)

Куча (пирамида) — это дерево, удовлетворяющее свойству кучи: для Min-Heap ключ каждого узла меньше или равен ключам его потомков. Обычно реализуется на базе массива.

**Интерфейс:**
* `push(item, priority)` — добавить элемент с приоритетом
* `pop()` — удалить и вернуть элемент с наивысшим приоритетом (наименьшим числом)
* `peek()` — вернуть верхушку
* `is_empty()` — проверка на пустоту

**Задание:** Реализовать минимальную кучу и использовать её для сортировки (Heap Sort).

<ClassRunner :instance="heap" title="Демонстрация: MinHeap" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab3/lab3_2.ts
:::

**Практическое задание:** Пирамидальная сортировка (Heap Sort)
Алгоритм добавляет все элементы в кучу, а затем извлекает их по одному. Так как Min-Heap всегда отдает минимум, на выходе получаем отсортированную последовательность.

<InteractiveRunner v-bind="heapSortProps"/>

## 3. AVL-дерево

AVL-дерево — это сбалансированное двоичное дерево поиска. Разница высот левого и правого поддеревьев (фактор баланса) для любого узла не превышает 1. Это гарантирует логарифмическую сложность операций поиска и вставки `O(log n)`.

**Интерфейс:**
* Все методы BST
* Автоматическая балансировка при `insert` и `delete` через повороты (`rotate_left`, `rotate_right`)

**Задание:** Реализовать AVL-дерево и сравнить его структуру с обычным BST на "плохих" данных.

<ClassRunner :instance="avl" title="Демонстрация: AVL Tree" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab3/lab3_3.ts
:::

### Сравнение балансировки (Практический эксперимент)

Чтобы увидеть разницу между BST и AVL, попробуйте последовательно добавить отсортированные числа (например: `1`, `2`, `3`, `4`, `5`) в оба дерева, используя **ClassRunner** выше.

1. **В обычном BST**: Дерево выродится в "палку" (связный список), уходящую вправо. Поиск в таком дереве будет `O(n)`.
2. **В AVL дереве**: Благодаря поворотам дерево останется сбалансированным, корень будет меняться. Поиск останется `O(log n)`.