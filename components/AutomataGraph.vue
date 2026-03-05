<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useData } from "vitepress";
import mermaid from "mermaid";

const props = defineProps<{
  config: any;
  isNfa?: boolean;
}>();

const graphContainer = ref<HTMLElement | null>(null);
const { isDark } = useData();

const colors = computed(() => {
  const dark = isDark.value;
  return {
    primary: dark ? "#3eaf7c" : "#3451b2",
    text: dark ? "#f6f6f7" : "#213547",
    line: dark ? "#65656b" : "#3c3c43",
    bg: dark ? "#161618" : "#ffffff",
    nodeBorder: dark ? "#3eaf7c" : "#3451b2",
  };
});

const mermaidCode = computed(() => {
  if (!props.config) return "";

  const { initialState, transitions, finalStates } = props.config;
  const safeId = (id: string) => "S_" + id.replace(/[^a-zA-Z0-9]/g, "_");
  const getLabel = (id: string) => {
    const text = id === "" ? "∅" : id;
    return ` ${text} `;
  };

  const c = colors.value;

  let code = "graph LR\n";

  code += `  START(( )) --> ${safeId(initialState)}\n`;
  code += `  style START fill:transparent,stroke:transparent;\n`;
  code += `  linkStyle 0 stroke:${c.primary},stroke-width:2px;\n`;

  for (const [fromState, paths] of Object.entries(transitions)) {
    for (const [char, target] of Object.entries(paths as any)) {
      const labelFrom = getLabel(fromState);

      if (props.isNfa && Array.isArray(target)) {
        target.forEach((t) => {
          const labelTo = getLabel(t);
          code += `  ${safeId(fromState)}(("${labelFrom}")) -->|"${char}"| ${safeId(t)}(("${labelTo}"))\n`;
        });
      } else if (typeof target === "string") {
        const labelTo = getLabel(target);
        code += `  ${safeId(fromState)}(("${labelFrom}")) -->|"${char}"| ${safeId(target)}(("${labelTo}"))\n`;
      }
    }
  }

  code += `  classDef finalState stroke:${c.primary},stroke-width:4px,fill:transparent;\n`;
  if (finalStates instanceof Set || Array.isArray(finalStates)) {
    finalStates.forEach((state: string) => {
      code += `  class ${safeId(state)} finalState;\n`;
    });
  }

  return code;
});

const renderGraph = async () => {
  await nextTick();

  if (!graphContainer.value || !mermaidCode.value) return;

  const id = "mermaid-" + Math.random().toString(36).substring(7);

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: colors.value.bg,
        fontFamily: "var(--vp-font-family-base)",
        primaryTextColor: colors.value.text,
        primaryBorderColor: colors.value.nodeBorder,
        lineColor: colors.value.line,
        secondaryColor: colors.value.bg,
        tertiaryColor: colors.value.bg,
        fontSize: "16px",
      },
    });

    const { svg } = await mermaid.render(id, mermaidCode.value);
    graphContainer.value.innerHTML = svg;
  } catch (e) {
    console.error("Mermaid Render Error:", e);
    graphContainer.value.innerHTML = `<div style="color:red">Error render graph</div>`;
  }
};

onMounted(() => renderGraph());

watch([mermaidCode, isDark], () => {
  if (graphContainer.value) graphContainer.value.innerHTML = "";
  renderGraph();
});
</script>

<template>
  <div class="automata-wrapper">
    <div
      ref="graphContainer"
      class="automata-graph-container"
    />
  </div>
</template>

<style scoped>
.automata-wrapper {
  margin: 16px 0;
  width: 100%;
  overflow-x: auto;
}

.automata-graph-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  min-height: 100px;
}

:deep(.nodeLabel) {
  font-family: var(--vp-font-family-mono) !important;
  font-weight: bold;
}
</style>
