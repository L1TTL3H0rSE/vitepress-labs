import sys

sys.setrecursionlimit(20000)

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

    start_node = 1
    if start_node > n:
        print(0)
        print()
        return

    visited = set()
    component = []
    
    queue = [start_node]
    visited.add(start_node)
    
    while queue:
        u = queue.pop(0)
        component.append(u)
        
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)
    
    component.sort()
    
    print(len(component))
    print(*(component))

if __name__ == "__main__":
    solve()