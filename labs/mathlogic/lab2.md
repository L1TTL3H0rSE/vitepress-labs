---
title: Лабораторная работа №2
description: Реализация базовых структур данных.
head:
  - - meta
    - name: keywords
      content: typescript, python, vue, структуры
---

<script setup lang="ts">
import ClassRunner from '../../components/ClassRunner.vue'
import InteractiveRunner, { InteractiveRunnerProps } from '../../components/InteractiveRunner.vue'

import { Stack } from './lab2/lab2_1'
import { Queue } from './lab2/lab2_2'
import { SinglyLinkedList } from './lab2/lab2_3'
import { DoublyLinkedList } from './lab2/lab2_4'

const stack = new Stack()
const queue = new Queue()
const sll = new SinglyLinkedList()
const dll = new DoublyLinkedList()

function reverseWords(words: string[]) {
  const _stack = new Stack<string>();
  words.forEach((e) => _stack.push(e));
  const sentence: string[] = [];
  while (!_stack.is_empty()) {
    sentence.push(_stack.pop());
  }
  return sentence.join(" ");
}

function wordsMapper(input: string) {
    if (!input.trim()) throw new Error("Введите предложение!");
    return input.trim().split(" ");
}

const stackProps: InteractiveRunnerProps<String[]> = {
  solution: reverseWords,
  mapper: wordsMapper,
  inputProps: {
    label: "Введите предложение",
    placeholder: "Например: 'Мама мыла раму'",
  }
};

function simulateQueue(customers: string[]) {
  const _queue = new Queue<String>();
  if (!_queue.is_empty()) {
    _queue.head = null;
  }
  const logs = [];
  customers.forEach((e) => {
    _queue.enqueue(e);
    logs.push(`Клиент ${e} прибыл.`);
  });
  logs.push("Начинаем принимать клиентов.");
  while (!_queue.is_empty()) {
    const e = _queue.dequeue();
    logs.push(`Клиент ${e} принят.`);
  }
  return logs.join("\n");
}

function peopleMapper(input: string) {
    if (!input.trim()) throw new Error("Введите предложение!");
    return input.trim().split(", ");
}

const queueProps: InteractiveRunnerProps<String[]> = {
  solution: simulateQueue,
  mapper: peopleMapper,
  inputProps: {
    label: "Введите людей через запятую",
    placeholder: "Например: 'Николай, Василий, Петр'",
  }
};
</script>

# Лабораторная работа №2. Реализация базовых структур данных

**Цель:** Освоить реализацию и использование базовых динамических структур данных — стека, очереди, односвязного и двусвязного списков.

## 1. Стек (Stack)

Стек — это структура данных, работающая по принципу LIFO (Last In, First Out — «последним пришел, первым ушел»).

**Интерфейс:**

* `push(data)` — добавить элемент в стек
* `pop()` — удалить и вернуть верхний элемент
* `peek()` — просмотреть верхний элемент без удаления
* `is_empty()` — проверить, пуст ли стек
* `size()` — вернуть количество элементов

**Задание:** Реализовать стек с использованием связного списка.

<ClassRunner :instance="stack" title="Демонстрация: Стек (Stack)" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab2/lab2_1.ts
:::

::: details Посмотреть исходный код (Python)
<<< @/labs/mathlogic/lab2/lab2_1.py
:::

**Практическое задание:** Разворот слов

<InteractiveRunner v-bind="stackProps"/>

## 2. Очередь (Queue)

Очередь — это структура данных, работающая по принципу FIFO (First In, First Out — «первым пришел, первым ушел»).

**Интерфейс:**

* `enqueue(data)` — добавить элемент в очередь
* `dequeue()` — удалить и вернуть первый элемент
* `peek()` — просмотреть первый элемент без удаления
* `is_empty()` — проверить, пуста ли очередь
* `size()` — вернуть количество элементов

**Задание:** Реализовать очередь на основе связного списка.

<ClassRunner :instance="queue" title="Демонстрация: Очередь (Queue)" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab2/lab2_2.ts
:::

::: details Посмотреть исходный код (Python)
<<< @/labs/mathlogic/lab2/lab2_2.py
:::

**Практическое задание:** Пример работы очереди

<InteractiveRunner v-bind="queueProps"/>

## 3. Односвязный список (Singly Linked List)

Динамическая структура данных, состоящая из узлов, где каждый узел хранит данные и ссылку на следующий узел.

**Интерфейс:**

* `append(data)` — добавить элемент в конец
* `prepend(data)` — добавить элемент в начало
* `insert(data, index)` — вставить элемент по индексу
* `remove(data)` — удалить элемент по значению
* `find(data)` — найти элемент и вернуть индекс
* `display()` — вывести элементы списка

**Задание:** Реализовать односвязный список и выполнить операцию вставки и удаления элементов по значению и позиции.

<ClassRunner :instance="sll" title="Демонстрация: Односвязный список" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab2/lab2_3.ts
:::

::: details Посмотреть исходный код (Python)
<<< @/labs/mathlogic/lab2/lab2_3.py
:::

**Практическое задание:** Можно проверить в компоненте ClassRunner

## 4. Двусвязный список (Doubly Linked List)

Структура данных, где каждый узел содержит ссылки как на следующий, так и на предыдущий элемент, что позволяет перемещаться в обоих направлениях.

**Интерфейс:**

* `append(data)` — добавить элемент в конец
* `prepend(data)` — добавить элемент в начало
* `insert(data, index)` — вставить элемент по индексу
* `remove(data)` — удалить элемент
* `display_forward()` — вывести элементы в прямом порядке
* `display_backward()` — вывести элементы в обратном порядке

**Задание:** Реализовать двусвязный список и продемонстрировать навигацию в обе стороны.

<ClassRunner :instance="dll" title="Демонстрация: Двусвязный список" />

::: details Посмотреть исходный код (TypeScript)
<<< @/labs/mathlogic/lab2/lab2_4.ts
:::

::: details Посмотреть исходный код (Python)
<<< @/labs/mathlogic/lab2/lab2_4.py
:::

**Практическое задание:** Можно проверить в компоненте ClassRunner

## 5. Описание решения

Поскольку в браузере достаточно сложно использовать код на питоне, мне пришлось перевести его на Typescript, чтобы иметь возможность наглядно демонстрировать работу каждой структуры данных. Также пришлось помучаться, чтобы правильно написать компонент ClassRunner, который может динамически принимать любой класс и при помощи рефлексии и прототипов сам отображать нужно количество инпутов, методов, данные и так далее.
