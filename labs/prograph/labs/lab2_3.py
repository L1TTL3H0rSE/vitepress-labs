import tkinter as Tk
import random
import math

def draw_fractal(x1, y1, x2, y2, depth):
    if depth == 0: return
    c.create_rectangle(x1, y1, x2, y2, outline="black")
    if depth % 2 != 0:
        draw_fractal(x1, y1, (x1+x2)/2, (y1+y2)/2, depth-1)
        draw_fractal((x1+x2)/2, (y1+y2)/2, x2, y2, depth-1)
    else:
        draw_fractal((x1+x2)/2, y1, x2, (y1+y2)/2, depth-1)
        draw_fractal(x1, (y1+y2)/2, (x1+x2)/2, y2, depth-1)

def stochastic_tree(x1, y1, x2, y2, num):
    if num == 0: return
    s1, c1 = math.sin(0.1), math.cos(0.1)
    s2, c2 = math.sin(1.0), math.cos(1.0)
    k, k1 = 0.3, 0.4
    
    x3 = (x2 - x1) * c1 - (y2 - y1) * s1 + x1
    y3 = (x2 - x1) * s1 + (y2 - y1) * c1 + y1
    x4 = x1 * (1 - k) + x3 * k
    y4 = y1 * (1 - k) + y3 * k
    x5 = x4 * (1 - k1) + x3 * k1
    y5 = y4 * (1 - k1) + y3 * k1
    x6 = (x5 - x4) * c2 - (y5 - y4) * s2 + x4
    y6 = (x5 - x4) * s2 + (y5 - y4) * c2 + y4
    x7 = (x5 - x4) * c2 + (y5 - y4) * s2 + x4
    y7 = -(x5 - x4) * s2 + (y5 - y4) * c2 + y4

    color = f"#{random.randrange(100):02X}{random.randrange(150, 255):02X}{random.randrange(100):02X}"
    c.create_line(x1, y1, x4, y4, fill=color, width=num)
    
    stochastic_tree(x4, y4, x3, y3, num - 1)
    stochastic_tree(x4, y4, x6, y6, num - 1)
    stochastic_tree(x4, y4, x7, y7, num - 1)

window = Tk.Tk()
window.title('Лаб 2 и 3. Фракталы')
window.geometry('800x600')
c = Tk.Canvas(window, bg='white')
c.pack(fill=Tk.BOTH, expand=1)

draw_fractal(50, 50, 350, 350, 5)
stochastic_tree(600, 550, 600, 350, 7)

window.mainloop()