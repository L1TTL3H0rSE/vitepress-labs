<script setup lang="ts" generic="T">
import { ref } from "vue";

export type InteractiveRunnerProps<T> = {
  solution: (array: T[]) => any;
  mapper: (input: string) => T[];
};

const props = defineProps<InteractiveRunnerProps<T>>();

const inputStr = ref("");
const outputStr = ref();
const errorStr = ref();

function run() {
  errorStr.value = "";
  outputStr.value = "";

  let arr: T[];
  try {
    arr = props.mapper(inputStr.value);
    try {
      outputStr.value = String(props.solution(arr));
    } catch (err: any) {
      if (err.message) {
        errorStr.value = err.message;
      } else {
        errorStr.value = err;
      }
    }
  } catch (err: any) {
    if (err.message) {
      errorStr.value = err.message;
    } else {
      errorStr.value = err;
    }
  }
}
</script>

<template>
  <div class="runner-container">
    <div class="input-group">
      <label for="arrInput">Введите массив (через запятую):</label>
      <input
        id="arrInput"
        v-model="inputStr"
        placeholder="Например: 0,1,2,3,4,5,6,7,8"
      />
    </div>
    <button
      class="run-btn"
      @click="run"
    >
      Запустить код
    </button>

    <div
      v-if="outputStr"
      class="output-group"
    >
      <strong>Результат:</strong>
      <div class="result-box">{{ outputStr }}</div>
    </div>
    <div
      v-if="errorStr"
      class="error-box"
    >
      {{ errorStr }}
    </div>
  </div>
</template>

<style scoped>
.runner-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  background-color: var(--vp-c-bg-soft);
  margin-top: 16px;
}
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.input-group label {
  font-weight: bold;
  margin-bottom: 8px;
}
.input-group input {
  padding: 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.run-btn {
  background-color: var(--vp-c-brand);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.run-btn:hover {
  background-color: var(--vp-c-brand-dark);
}
.output-group {
  margin-top: 16px;
}
.result-box {
  margin-top: 8px;
  padding: 12px;
  background-color: var(--vp-c-bg);
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 4px;
  font-family: monospace;
}
.error-box {
  margin-top: 16px;
  color: #ff4a4a;
  font-weight: bold;
}
</style>
