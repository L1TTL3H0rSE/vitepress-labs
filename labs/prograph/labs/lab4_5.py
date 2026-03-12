import tkinter as Tk
import math

n = 0
xn, yn = 0, 0

def my_line(x1, y1, x2, y2):
    b = 0
    dx, dy = abs(x2 - x1), abs(y2 - y1)
    if dx > dy:
        if x1 > x2: x1, x2, y1, y2 = x2, x1, y2, y1
        k = (y2 - y1) / (x2 - x1) if x2 != x1 else 0
        for x in range(int(x1), int(x2) + 1):
            y = y1 + (x - x1) * k
            if b < 4 or (8 <= b < 11):
                c.create_oval(x, y, x, y, fill="black", width=1)
            b = (b + 1) % 14
    else:
        if y1 > y2: x1, x2, y1, y2 = x2, x1, y2, y1
        k = (x2 - x1) / (y2 - y1) if y2 != y1 else 0
        for y in range(int(y1), int(y2) + 1):
            x = x1 + (y - y1) * k
            if b < 4 or (8 <= b < 11):
                c.create_oval(x, y, x, y, fill="black", width=1)
            b = (b + 1) % 14

def my_oval(xc, yc, r):
    b = 0
    step_ugol = 1 / r
    xp, yp = None, None
    ugol = 0
    while ugol <= 6.28:
        x = xc + math.sin(ugol) * r
        y = yc + math.cos(ugol) * r
        if x != xp or y != yp:
            if b < 2 or b == 4:
                c.create_oval(x, y, x, y, fill="red", width=1)
            b = (b + 1) % 7
            xp, yp = x, y
        ugol += step_ugol

def click(event):
    global n, xn, yn
    if n == 0:
        xn, yn = event.x, event.y
        n = 1
    else:
        r = math.sqrt((event.x - xn)**2 + (event.y - yn)**2)
        my_oval(xn, yn, r)
        my_line(xn, yn, event.x, event.y)
        n = 0

window = Tk.Tk()
window.title('Лаб 4 и 5. Свои типы линий (Вариант 18)')
window.geometry('800x600')
c = Tk.Canvas(window, bg='white')
c.pack(fill=Tk.BOTH, expand=1)
c.bind('<1>', click)

Tk.Label(window, text="Кликайте: первый клик - центр/начало, второй - радиус/конец").place(x=10, y=10)
window.mainloop()