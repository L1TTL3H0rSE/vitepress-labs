<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";

interface MethodInfo {
  name: string;
  args: string[];
}

interface ClassRunnerProps {
  instance: any;
  title?: string;
}

const { instance, title = "Инспектор структуры" } =
  defineProps<ClassRunnerProps>();

const updateTrigger = ref(0);
const lastResult = ref<any>(null);
const lastError = ref<string | null>(null);

const methodInputs = ref<Record<string, Record<string, string>>>({});

const methodsList = computed<MethodInfo[]>(() => {
  if (!instance) return [];
  const proto = Object.getPrototypeOf(instance);
  if (!proto) return [];
  const propsNames = Object.getOwnPropertyNames(proto);
  return propsNames
    .filter((name) => {
      return (
        typeof instance[name] === "function" &&
        name !== "constructor" &&
        !name.startsWith("_")
      );
    })
    .map((name) => ({
      name,
      args: getFunctionArgs(instance[name]),
    }));
});

const serializedState = computed(() => {
  updateTrigger.value;
  const seen = new WeakSet();
  return JSON.stringify(
    instance,
    (key, value) => {
      if (key.startsWith("_")) return undefined;
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Циклическая ссылка]";
        seen.add(value);
      }
      return value;
    },
    2,
  );
});

const invokeMethod = (methodName: string, argsNames: string[]) => {
  lastResult.value = null;
  lastError.value = null;
  try {
    const argsToPass = argsNames.map((argName) => {
      const rawValue = methodInputs.value[methodName][argName];
      return parseArgument(rawValue);
    });
    const result = instance[methodName](...argsToPass);
    lastResult.value = result !== undefined ? result : "Успешно (void)";
  } catch (err: any) {
    lastError.value = err.message ?? String(err);
  } finally {
    updateTrigger.value++;
    argsNames.forEach((arg) => {
      methodInputs.value[methodName][arg] = "";
    });
  }
};

function getFunctionArgs(func: Function): string[] {
  const str = func.toString();
  const match = str.match(/^[^(]*\(\s*([^)]*)\)/m);
  if (!match || !match[1].trim()) return [];

  return match[1]
    .split(",")
    .map((arg) => arg.split("=")[0].trim())
    .filter(Boolean);
}

function parseArgument(val: string) {
  const trimmed = val.trim();
  if (trimmed === "") return undefined;
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const num = Number(trimmed);
  if (!Number.isNaN(num)) return num;
  try {
    return JSON.parse(trimmed);
  } catch {
    return val;
  }
}

watchEffect(() => {
  methodsList.value.forEach((method) => {
    if (!methodInputs.value[method.name]) {
      methodInputs.value[method.name] = {};
    }
    method.args.forEach((arg) => {
      if (!(arg in methodInputs.value[method.name])) {
        methodInputs.value[method.name][arg] = "";
      }
    });
  });
});
</script>

<template>
  <div class="structure-inspector">
    <div class="header">
      <h3>{{ title }}</h3>
    </div>

    <div class="state-panel">
      <div class="panel-title">Текущее состояние:</div>
      <pre class="state-code"><code>{{ serializedState }}</code></pre>
    </div>

    <div
      v-if="lastResult !== null"
      class="alert success"
    >
      <strong>Результат:</strong>
      {{ lastResult }}
    </div>
    <div
      v-if="lastError !== null"
      class="alert error"
    >
      <strong>Ошибка:</strong>
      {{ lastError }}
    </div>

    <div class="methods-panel">
      <div class="panel-title">Доступные методы:</div>

      <div
        v-for="method in methodsList"
        :key="method.name"
        class="method-row"
      >
        <span class="method-name">{{ method.name }}</span>

        <div class="method-controls">
          <input
            v-for="arg in method.args"
            :key="arg"
            v-model="methodInputs[method.name][arg]"
            class="vp-input"
            :placeholder="`арг: ${arg}`"
            type="text"
            @keydown.enter="invokeMethod(method.name, method.args)"
          />
          <button
            class="vp-button"
            @click="invokeMethod(method.name, method.args)"
          >
            Вызвать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.structure-inspector {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  margin: 16px 0;
}

.header h3 {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-1);
}

.panel-title {
  font-size: 0.85em;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.state-panel {
  margin-bottom: 20px;
}

.state-code {
  background-color: var(--vp-code-bg);
  padding: 12px;
  border-radius: 6px;
  font-size: 0.85em;
  overflow-x: auto;
  margin: 0;
}

.methods-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.method-name {
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.method-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.vp-input {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  outline: none;
  transition: border-color 0.25s;
  min-width: 120px;
}

.vp-input:focus {
  border-color: var(--vp-c-brand-1);
}

.vp-button {
  background-color: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
  border: 1px solid var(--vp-button-alt-border);
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.vp-button:hover {
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.alert.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--vp-c-green-1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.alert.error {
  background-color: rgba(244, 63, 94, 0.1);
  color: var(--vp-c-red-1);
  border: 1px solid rgba(244, 63, 94, 0.2);
}
</style>
