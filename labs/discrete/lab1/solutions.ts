import type { InteractiveRunnerProps } from "../../../components/InteractiveRunner.vue";

type GraphData = { n: number; adj: number[][] };

export const task1Props: InteractiveRunnerProps<GraphData> = {
  inputProps: {
    label: "Ввод (N M, затем ребра):",
    placeholder: "4 5\n2 2\n3 4\n2 3\n1 3\n2 4",
  },

  mapper: (input: string): GraphData => {
    const tokens = input.trim().split(/\s+/).map(Number);
    if (tokens.length < 2)
      throw new Error("Некорректный ввод: ожидаются N и M");
    const n = tokens[0];
    const m = tokens[1];
    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    let tokenIdx = 2;
    for (let i = 0; i < m; i++) {
      if (tokenIdx + 1 >= tokens.length) break;
      const u = tokens[tokenIdx++];
      const v = tokens[tokenIdx++];
      if (u < 1 || u > n || v < 1 || v > n) continue;
      adj[u].push(v);
      adj[v].push(u);
    }

    return { n, adj };
  },

  solution: ({ n, adj }: GraphData): string => {
    const startNode = 1;
    if (n === 0) return "0";
    const visited = new Set<number>();
    const queue: number[] = [startNode];
    visited.add(startNode);
    const component: number[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      component.push(u);
      for (const v of adj[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
        }
      }
    }

    component.sort((a, b) => a - b);
    return `${component.length}\n${component.join(" ")}`;
  },
};

export const task2Props: InteractiveRunnerProps<GraphData> = {
  inputProps: {
    label: "Ввод (N M, затем ребра):",
    placeholder: "6 4\n3 1\n1 2\n5 4\n2 3",
  },

  mapper: (input: string): GraphData => {
    const tokens = input.trim().split(/\s+/).map(Number);
    if (tokens.length < 2) throw new Error("Некорректный ввод");

    const n = tokens[0];
    const m = tokens[1];
    const adj: number[][] = Array.from({ length: n + 1 }, () => []);

    let tokenIdx = 2;
    for (let i = 0; i < m; i++) {
      if (tokenIdx + 1 >= tokens.length) break;
      const u = tokens[tokenIdx++];
      const v = tokens[tokenIdx++];

      if (u >= 1 && u <= n && v >= 1 && v <= n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    return { n, adj };
  },

  solution: ({ n, adj }: GraphData): string => {
    const visited = new Set<number>();
    const components: number[][] = [];
    for (let i = 1; i <= n; i++) {
      if (!visited.has(i)) {
        const component: number[] = [];
        const queue: number[] = [i];
        visited.add(i);
        while (queue.length > 0) {
          const u = queue.shift()!;
          component.push(u);
          for (const v of adj[u]) {
            if (!visited.has(v)) {
              visited.add(v);
              queue.push(v);
            }
          }
        }

        component.sort((a, b) => a - b);
        components.push(component);
      }
    }
    let output = `${components.length}`;
    for (const comp of components) {
      output += `\n${comp.length}\n${comp.join(" ")}`;
    }
    return output;
  },
};
