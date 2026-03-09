<script setup lang="ts">
import { ref, watch } from "vue";
import { TuringMachine, type TuringProgram } from "../labs/lingo/task3/turing";
import {
  PROGRAM_ADDITION,
  PROGRAM_SUBTRACTION,
  PROGRAM_COPY,
} from "../labs/lingo/task3/presets";

const selectedProgram = ref("add");
const inputTape = ref("XX_XXX");
const isRunning = ref(false);
const speed = ref(300);
const machine = ref<TuringMachine | null>(null);
const stepsCount = ref(0);

const programs: Record<
  string,
  { name: string; prog: TuringProgram; default: string }
> = {
  add: { name: "Сложение (Unary)", prog: PROGRAM_ADDITION, default: "XX_XXX" },
  sub: {
    name: "Вычитание (Unary)",
    prog: PROGRAM_SUBTRACTION,
    default: "XXX_X",
  },
  copy: { name: "Копирование", prog: PROGRAM_COPY, default: "XXX" },
};

const initMachine = () => {
  stop();
  const conf = programs[selectedProgram.value];
  machine.value = new TuringMachine(inputTape.value, conf.prog);
  stepsCount.value = 0;
};

watch(selectedProgram, (newVal) => {
  inputTape.value = programs[newVal].default;
  initMachine();
});

let timer: any = null;

const step = () => {
  if (!machine.value) return;
  const canContinue = machine.value.step();
  stepsCount.value++;
  if (!canContinue) {
    stop();
  }
};

const run = () => {
  if (isRunning.value) return stop();
  isRunning.value = true;
  timer = setInterval(step, speed.value);
};

const stop = () => {
  isRunning.value = false;
  if (timer) clearInterval(timer);
};

if (!machine.value) initMachine();
</script>

<template>
  <div class="turing-container">
    <div class="controls">
      <div class="row">
        <label>Программа:</label>
        <select
          v-model="selectedProgram"
          class="vp-select"
        >
          <option
            v-for="(val, key) in programs"
            :key="key"
            :value="key"
          >
            {{ val.name }}
          </option>
        </select>
      </div>
      <div class="row">
        <label>Лента (ввод):</label>
        <input
          v-model="inputTape"
          class="vp-input"
          @change="initMachine"
        />
      </div>
      <div class="buttons">
        <button
          class="vp-btn"
          @click="initMachine"
        >
          Сброс
        </button>
        <button
          class="vp-btn"
          :disabled="isRunning"
          @click="step"
        >
          Шаг
        </button>
        <button
          class="vp-btn primary"
          @click="run"
        >
          {{ isRunning ? "Стоп" : "Запуск" }}
        </button>
      </div>
    </div>
    <div
      v-if="machine"
      class="tape-viewport"
    >
      <div
        class="tape-track"
        :style="{
          transform: `translateX(calc(50% - ${machine.head * 42 + 21}px))`,
        }"
      >
        <div
          v-for="(cell, index) in machine.tape"
          :key="index"
          class="tape-cell"
          :class="{ active: index === machine.head }"
        >
          {{ cell === "_" ? "" : cell }}
          <div
            v-if="index === machine.head"
            class="head-marker"
          >
            ▲
          </div>
          <div class="index-marker">{{ index }}</div>
        </div>
      </div>
    </div>
    <div
      v-if="machine"
      class="status-panel"
    >
      <div>
        Состояние:
        <strong>{{ machine.state }}</strong>
      </div>
      <div>Шагов: {{ stepsCount }}</div>
    </div>
  </div>
</template>

<style scoped>
.turing-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  margin: 20px 0;
}

.row {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.vp-select,
.vp-input {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.vp-btn {
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  background: var(--vp-c-bg);
  transition: all 0.2s;
}

.vp-btn:hover {
  background: var(--vp-c-bg-mute);
}

.vp-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
}

.vp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tape-viewport {
  width: 100%;
  height: 80px;
  overflow: hidden;
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.tape-track {
  display: flex;
  position: absolute;
  left: 0;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.tape-cell {
  width: 40px;
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 1.2em;
  font-weight: bold;
  margin: 0 1px;
  position: relative;
  background: var(--vp-c-bg-soft);
}

.tape-cell.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
  z-index: 2;
}

.head-marker {
  position: absolute;
  bottom: -20px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
}

.index-marker {
  position: absolute;
  top: -15px;
  font-size: 10px;
  color: var(--vp-c-text-2);
}

.status-panel {
  margin-top: 16px;
  display: flex;
  gap: 20px;
  font-family: monospace;
  color: var(--vp-c-text-2);
}
</style>
