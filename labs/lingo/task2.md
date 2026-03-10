---
title: Лабораторная работа №2
description: Парсинг арифметических выражений, польская нотация и стековый калькулятор.
---

<script setup lang="ts">
import InteractiveRunner from '../../components/InteractiveRunner.vue'
import { MathExpressionProcessor } from './task2/task2_1'

const processor = new MathExpressionProcessor();

function expressionMapper(input: string) {
    if (!input.trim()) throw new Error("Введите математическое выражение!");
    return input;
}

function solveExpression(input: string) {
    try {
        const postfix = processor.toPostfix(input);
        const prefix = processor.toPrefix(input);
        const result = processor.evaluatePostfix(postfix);

        return `
== РЕЗУЛЬТАТЫ АНАЛИЗА ==

1. Постфиксная форма (Обратная польская запись):
   [ ${postfix.join(' ')} ]

2. Префиксная форма (Польская запись):
   [ ${prefix.join(' ')} ]

3. Результат вычисления:
   ${result}
        `.trim();
    } catch (e: any) {
        return `Ошибка разбора: ${e.message}`;
    }
}
</script>

# Лабораторная работа №2. Синтаксический анализ и вычисление выражений

**Задание:**

1. Реализовать преобразование инфиксной записи (обычной) в постфиксную и префиксную.
2. Реализовать калькулятор, вычисляющий выражение на основе постфиксной записи.

## Теоретическая справка

Для решения задачи используется **алгоритм сортировочной станции (Shunting-yard algorithm)** Эдсгера Дейкстры. Он позволяет преобразовать выражение с учетом приоритета операций и скобок в форму, удобную для машинного вычисления.

### Формы записи

* **Инфиксная (Infix):** `(A + B) * C` — привычная для человека, но сложная для парсинга (нужны скобки).
* **Постфиксная (Postfix / RPN):** `A B + C *` — оператор стоит *после* операндов. Скобки не нужны. Идеальна для стековых вычислений.
* **Префиксная (Prefix):** `* + A B C` — оператор стоит *перед* операндами (используется в Lisp).

## Интерактивный Калькулятор

Введите любое математическое выражение. Поддерживаются:

* Целые и дробные числа (`10`, `2.5`)
* Операторы: `+`, `-`, `*`, `/`, `^` (степень)
* Скобки `(` и `)`

<InteractiveRunner
  :solution="solveExpression"
  :mapper="expressionMapper"
  :inputProps="{ 
    label: 'Введите математическое выражение', 
    placeholder: 'Например: 3 + 4 * 2 / ( 1 - 5 ) ^ 2' 
  }"
/>

## Реализация

### Основной класс процессора

Класс реализует токенизацию (через Regex), алгоритм сортировочной станции и стековую машину для вычислений.

::: details Исходный код (TypeScript)
<<< @/labs/lingo/task2/task2_1.ts
:::
