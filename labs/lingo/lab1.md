---
title: Лабораторная работа №1
description: Автомат проверки правильности скобок (КС-грамматики).
---

<script setup lang="ts">
import InteractiveRunner from '../../components/InteractiveRunner.vue'
import AutomataGraph from '../../components/AutomataGraph.vue';
import { ConverterAutomata } from './lab1/lab1_2';
import { PushdownAutomata, BRACKET_PAIRS } from './lab1/lab1_1'

const automata = new PushdownAutomata(BRACKET_PAIRS);

const nfaConfig = {
  alphabet: new Set(["a", "b"]),
  initialState: "q0",
  finalStates: new Set(["q2"]),
  transitions: {
    "q0": { "a": ["q0", "q1"], "b": ["q0"] },
    "q1": { "b": ["q2"] },
    "q2": {}
  }
};

const converter = new ConverterAutomata(nfaConfig);
const dfaResult = converter.determinize();

const nfaString = JSON.stringify(nfaConfig, (key, value) =>
  value instanceof Set ? [...value] : value, 2);
  
const dfaString = JSON.stringify(dfaResult, (key, value) =>
  value instanceof Set ? [...value] : value, 2);

function checkBrackets(input: string) {
    try {
        automata.process(input);
        return "Скобки расставлены правильно!";
    } catch (e: any) {
        return "Ошибка: " + e.message;
    }
}

function stringMapper(input: string) {
    if (!input.trim()) throw new Error("Введите строку для проверки!");
    return input.trim();
}
</script>

# Лабораторная работа №1. Контекстно-свободные грамматики и Автоматы

**Задание 1:** Используя контекстно-свободные грамматики, реализовать автомат контроля правильности расстановки скобок.

## Описание работы

Для проверки скобочной последовательности используется **автомат с магазинной памятью (Pushdown Automaton)**.
Поскольку данная задача описывается контекстно-свободной грамматикой (КСГ), обычного конечного автомата недостаточно — требуется структура данных Stack (стек) для запоминания вложенности.

Алгоритм:

1. Читаем строку слева направо.
2. При встрече открывающей скобки помещаем её в стек.
3. При встрече закрывающей скобки извлекаем верхний элемент стека и проверяем их соответствие.
4. Если стек пуст до окончания строки или после завершения проверки в нём остались элементы — последовательность неверна.

## Интерактивная демонстрация

<InteractiveRunner
  :solution="checkBrackets"
  :mapper="stringMapper"
  :inputProps="{ label: 'Введите выражение со скобками', placeholder: 'Например: a + (b * [c - d])' }"
/>

::: details Исходный код автомата (TypeScript)
<<< @/labs/lingo/lab1/lab1_1.ts
:::

::: details Исходный код автомата (Python)
<<< @/labs/lingo/lab1/lab1_1.py
:::

## Задание 2: Детерминизация автомата

**Задача:** Написать недетерминированный конечный автомат (НКА) и привести его к детерминированному (ДКА).

В данном примере реализован алгоритм (Метод подмножеств / Powerset construction), который принимает конфигурацию НКА и математически сводит её к строгому графу ДКА, устраняя неоднозначности переходов.

<div style="display: flex; gap: 20px; margin-top: 20px;">
  <div style="flex: 1;">
    <h3>Исходный НКА (NFA)</h3>
    <pre><code>{{ nfaString }}</code></pre>
  </div>
  <div style="flex: 1;">
    <h3>Результат ДКА (DFA)</h3>
    <pre><code>{{ dfaString }}</code></pre>
  </div>
</div>

## Визуализация недетерминированного автомата (НКА)

Этот автомат может по символу `a` остаться в `q0` или пойти в `q1`.

<AutomataGraph :config="nfaConfig" :isNfa="true" />

## Результат детерминизации (ДКА)

Автомат был программно преобразован с помощью метода подмножеств. Теперь из каждого состояния выходит только один уникальный путь для каждого символа.

<AutomataGraph :config="dfaResult" :isNfa="false" />

::: details Исходный код конвертера (TypeScript)
<<< @/labs/lingo/lab1/lab1_2.ts
:::

::: details Исходный код конвертера (Python)
<<< @/labs/lingo/lab1/lab1_2.py
:::
