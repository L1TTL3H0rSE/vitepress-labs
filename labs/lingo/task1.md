---
title: Лабораторная работа №1
description: Автомат проверки правильности скобок (КС-грамматики).
---

<script setup lang="ts">
import { ref, computed } from 'vue'
import InteractiveRunner from '../../components/InteractiveRunner.vue'
import AutomataGraph from '../../components/AutomataGraph.vue';
import { ConverterAutomata } from './task1/task1_2';
import { PushdownAutomata, BRACKET_PAIRS } from './task1/task1_1'

const automata = new PushdownAutomata(BRACKET_PAIRS);

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

const defaultNfa = {
  "alphabet": ["a", "b", "ε"],
  "initialState": "q0",
  "finalStates": ["q2"],
  "transitions": {
    "q0": { "ε": ["q1"] },
    "q1": { "a": ["q1"], "b": ["q2"] },
    "q2": {}
  }
};

const nfaInput = ref(JSON.stringify(defaultNfa, null, 2));
const parseError = ref("");

const parsedNfa = computed(() => {
  parseError.value = "";
  try {
    const raw = JSON.parse(nfaInput.value);
    return {
      alphabet: new Set(raw.alphabet || []),
      initialState: raw.initialState || "",
      finalStates: new Set(raw.finalStates || []),
      transitions: raw.transitions || {}
    };
  } catch (e: any) {
    parseError.value = "Ошибка JSON: " + e.message;
    return null;
  }
});

const dfaResult = computed(() => {
  if (!parsedNfa.value) return null;
  try {
    const converter = new ConverterAutomata(parsedNfa.value as any);
    return converter.determinize();
  } catch (e: any) {
    parseError.value = "Ошибка конвертации: " + e.message;
    return null;
  }
});

const dfaString = computed(() => {
  if (!dfaResult.value) return "";
  return JSON.stringify(dfaResult.value, (key, value) =>
    value instanceof Set ? [...value] : value, 2);
});
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
@media (min-width: 768px) {
  .editor-container {
    flex-direction: row;
  }
}
.editor-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.json-input {
  width: 100%;
  height: 250px;
  font-family: var(--vp-font-family-mono);
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: vertical;
}
.json-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.error-msg {
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 0.9em;
}
.output-pre {
  height: 250px;
  overflow-y: auto;
  margin: 0 !important;
}
</style>

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
<<< @/labs/lingo/task1/task1_1.ts
:::

::: details Исходный код автомата (Python)
<<< @/labs/lingo/task1/task1_1.py
:::

## Задание 2: Детерминизация автомата

**Задача:** Написать недетерминированный конечный автомат (НКА) и привести его к детерминированному (ДКА).

Вы можете отредактировать JSON-конфигурацию НКА в левом окне (массивы автоматически конвертируются в `Set`). Правое окно и графы обновятся автоматически!

<div class="editor-container">
  <div class="editor-box">
    <h3>Исходный НКА (Редактируемый JSON)</h3>
    <textarea v-model="nfaInput" class="json-input" spellcheck="false"></textarea>
    <div v-if="parseError" class="error-msg">{{ parseError }}</div>
  </div>
  <div class="editor-box">
    <h3>Результат ДКА</h3>
    <pre class="output-pre"><code>{{ dfaString || 'Ожидание корректного ввода...' }}</code></pre>
  </div>
</div>

## Визуализация недетерминированного автомата (НКА)

<AutomataGraph v-if="parsedNfa" :config="parsedNfa" :isNfa="true" />
<div v-else style="color: grey; margin-top: 10px;">Исправьте ошибки в JSON для отображения графа.</div>

## Результат детерминизации (ДКА)

<AutomataGraph v-if="dfaResult" :config="dfaResult" :isNfa="false" />

::: details Исходный код конвертера (TypeScript)
<<< @/labs/lingo/task1/task1_2.ts
:::

::: details Исходный код конвертера (Python)
<<< @/labs/lingo/task1/task1_2.py
:::
