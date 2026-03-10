<script setup lang="ts">
import { ref } from "vue";
import { Lexer } from "../labs/lingo/coursework/lexer";
import { Parser } from "../labs/lingo/coursework/parser";
import { Translator } from "../labs/lingo/coursework/translator";

const sourceCode = ref(`целое размер;
матрица М[3];

размер = 3;
пока (размер > 0) {
    если (размер == 2) {
        сортировать(М);
    } иначе {
        вывод(размер);
    }
    размер = размер - 1;
}`);

const compiledJS = ref("");
const logs = ref<string[]>([]);
const errorStr = ref("");
const astJson = ref("");

function compileAndRun() {
  errorStr.value = "";
  compiledJS.value = "";
  astJson.value = "";
  logs.value = [];

  try {
    const lexer = new Lexer(sourceCode.value);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    astJson.value = JSON.stringify(ast, null, 2);
    const translator = new Translator(ast);
    const jsCode = translator.translate();
    compiledJS.value = jsCode;
    const fakeConsole = {
      log: (...args: any[]) => {
        const msg = args
          .map((a) => (typeof a == "object" ? JSON.stringify(a) : String(a)))
          .join(" ");
        logs.value.push(msg);
      },
    };
    const fakePrompt = (msg: string) => {
      const val = window.prompt(msg);
      return val ? val : "0";
    };
    const runFunction = new Function("console", "prompt", jsCode);
    runFunction(fakeConsole, fakePrompt);
  } catch (err: any) {
    errorStr.value = err.message;
  }
}
</script>

<template>
  <div class="compiler-wrapper">
    <div class="editor-section">
      <h3>Исходный код (Русский Язык)</h3>
      <textarea
        v-model="sourceCode"
        class="code-input"
        placeholder="Введите код программы..."
        rows="12"
      />
      <button
        class="run-btn"
        @click="compileAndRun"
      >
        Компилировать и Выполнить
      </button>
      <div
        v-if="errorStr"
        class="error-box"
      >
        <strong>Ошибка компиляции:</strong>
        {{ errorStr }}
      </div>
    </div>
    <div
      v-if="compiledJS"
      class="results-section"
    >
      <div class="panel">
        <h3>Абстрактное Синтаксическое Дерево (AST)</h3>
        <pre class="code-box"><code>{{ astJson }}</code></pre>
      </div>
      <div class="panel">
        <h3>Сгенерированный JavaScript</h3>
        <pre class="code-box"><code>{{ compiledJS }}</code></pre>
      </div>
      <div class="panel">
        <h3>Вывод программы (Консоль)</h3>
        <pre class="console-box">
          <div
            v-for="(log, i) in logs"
            :key="i"
            >> {{ log }}</div><div v-if="logs.length == 0"
            style="color: #666;"
          >
            [Вывод пуст]
          </div>
        </pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compiler-wrapper {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.code-input {
  width: 100%;
  font-family: var(--vp-font-family-mono);
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: vertical;
}
.run-btn {
  margin-top: 12px;
  background-color: var(--vp-c-brand-1);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}
.run-btn:hover {
  opacity: 0.8;
}
.error-box {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(244, 63, 94, 0.1);
  color: var(--vp-c-red-1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 6px;
}
.results-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) {
  .results-section {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.panel h3 {
  font-size: 1.1em;
  margin-bottom: 8px;
}
.code-box {
  background-color: var(--vp-code-bg);
  padding: 12px;
  border-radius: 6px;
  font-size: 0.85em;
  overflow-x: auto;
  max-height: 400px;
}
.console-box {
  background-color: #1e1e1e;
  color: #4ade80;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9em;
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
  font-family: var(--vp-font-family-mono);
}
</style>
