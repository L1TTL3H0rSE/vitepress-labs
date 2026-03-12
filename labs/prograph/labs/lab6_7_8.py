import tkinter as Tk
from tkinter import colorchooser
import math

n, vvod = 0, True
mas = tuple()
figure = None
startx, starty = 0, 0

def p_change():
    global mas
    p = 0
    for i in range(0, len(mas)-2, 2):
        p += math.sqrt((mas[i] - mas[i+2])**2 + (mas[i+1] - mas[i+3])**2)
    p_label.config(text=f"Периметр = {math.ceil(p)}")

def s_change():
    global mas
    s = 0
    for i in range(0, len(mas)-2, 2):
        s += (mas[i] - mas[i+2]) * (mas[i+1] + mas[i+3])
    s_label.config(text=f"Площадь = {math.ceil(abs(s/2))}")

def click(event):
    global vvod, n, mas, figure, startx, starty
    if vvod:
        mas = mas + (event.x, event.y)
        if n == 0:
            figure = c.create_oval(event.x, event.y, event.x, event.y, fill="black")
        else:
            c.delete(figure)
            figure = c.create_line(*mas, fill='black', width=2)
            p_change()
        n += 2
    else:
        startx, starty = event.x, event.y

def press_btn_end():
    global vvod, n, mas, figure
    if n > 4 and vvod:
        mas = mas + (mas[0], mas[1])
        c.delete(figure)
        figure = c.create_polygon(*mas, fill='white', outline="black", width=2, activewidth=4)
        p_change()
        s_change()
        vvod = False

def press_btn_color():
    global vvod, figure
    if not vvod:
        result = colorchooser.askcolor(initialcolor="white")
        if result[1]: c.itemconfig(figure, fill=result[1])

def figure_move(event):
    global vvod, figure, startx, starty
    if not vvod and figure in c.find_overlapping(startx, starty, startx+1, starty+1):
        dx, dy = event.x - startx, event.y - starty
        c.move(figure, dx, dy)
        startx, starty = event.x, event.y

def move_dir(dx, dy):
    global vvod, figure
    if not vvod:
        step = int(delta_value.get())
        c.move(figure, dx * step, dy * step)

window = Tk.Tk()
window.title('Лаб 6, 7, 8. Полигон: Площадь, Цвет, Перемещение')
window.geometry('800x600')

c = Tk.Canvas(window, bg='white')
c.pack(fill=Tk.BOTH, expand=1, side='left')
c.bind('<1>', click)
c.bind('<B1-Motion>', figure_move)

frame = Tk.Frame(window, highlightthickness=0, borderwidth=0, relief=Tk.FLAT)
frame.pack(side='right', padx=10, fill='y')

p_label = Tk.Label(frame, text="Периметр = 0")
p_label.pack(anchor=Tk.NW, pady=5)
s_label = Tk.Label(frame, text="Площадь = 0")
s_label.pack(anchor=Tk.NW, pady=5)

Tk.Button(frame, text='Замкнуть', width=20, command=press_btn_end).pack(pady=5)
Tk.Button(frame, text='Выбрать цвет', width=20, command=press_btn_color).pack(pady=5)

Tk.Label(frame, text="Перемещение фигуры:").pack(pady=10)
Tk.Button(frame, text='вверх', command=lambda: move_dir(0, -1)).pack()
btn_frame = Tk.Frame(frame)
btn_frame.pack()
Tk.Button(btn_frame, text='влево', command=lambda: move_dir(-1, 0)).pack(side=Tk.LEFT)
delta_value = Tk.Entry(btn_frame, width=5)
delta_value.insert(0, "10")
delta_value.pack(side=Tk.LEFT, padx=5)
Tk.Button(btn_frame, text='вправо', command=lambda: move_dir(1, 0)).pack(side=Tk.LEFT)
Tk.Button(frame, text='вниз', command=lambda: move_dir(0, 1)).pack()

window.mainloop()