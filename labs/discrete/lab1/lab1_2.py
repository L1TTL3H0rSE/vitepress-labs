import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    iterator = iter(input_data)
    try:
        n = int(next(iterator))
        m = int(next(iterator))
    except StopIteration:
        return

    adj = [[] for _ in range(n + 1)]
    
    for _ in range(m):
        try:
            u = int(next(iterator))
            v = int(next(iterator))
            adj[u].append(v)
            adj[v].append(u)
        except StopIteration:
            break

    visited = set()
    components = []

    for i in range(1, n + 1):
        if i not in visited:
            comp = []
            queue = [i]
            visited.add(i)
            
            while queue:
                u = queue.pop(0)
                comp.append(u)
                
                for v in adj[u]:
                    if v not in visited:
                        visited.add(v)
                        queue.append(v)
            
            comp.sort()
            components.append(comp)

    print(len(components))
    for comp in components:
        print(len(comp))
        print(*(comp))

if __name__ == "__main__":
    solve()