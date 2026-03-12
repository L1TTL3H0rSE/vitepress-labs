import tkinter as Tk
import math

def move_butterfly():
    global bx
    c.move('butterfly', 5, math.sin(bx/10)*5) # Летит волной
    bx += 5
    if bx > 800:
        c.move('butterfly', -900, 0)
        bx = -100
    window.after(50, move_butterfly)

def move_platypus():
    global px
    c.move('platypus', -3, 0) # Плывет влево
    px -= 3
    if px < -100:
        c.move('platypus', 900, 0)
        px = 800
    window.after(50, move_platypus)

window = Tk.Tk()
window.title('Лаб 1. Анимация (Вар 18)')
window.geometry('800x600')
c = Tk.Canvas(window, bg='lightblue')
c.pack(fill=Tk.BOTH, expand=1)

bx = 100
c.create_oval(100, 100, 150, 180, fill='yellow', tags='butterfly')
c.create_oval(150, 100, 200, 180, fill='yellow', tags='butterfly')
c.create_oval(115, 120, 135, 160, fill='red', tags='butterfly')
c.create_oval(165, 120, 185, 160, fill='red', tags='butterfly')
c.create_polygon(100, 180, 150, 180, 125, 250, fill='orange', outline='black', tags='butterfly')
c.create_polygon(150, 180, 200, 180, 175, 250, fill='orange', outline='black', tags='butterfly')
c.create_oval(140, 120, 160, 200, fill='brown', tags='butterfly')

px = 600
c.create_oval(600, 400, 700, 440, fill='#8B4513', tags='platypus')
c.create_polygon(700, 410, 750, 420, 700, 430, fill='#5C4033', outline='black', tags='platypus')
c.create_oval(570, 415, 610, 425, fill='#2F4F4F', tags='platypus')
c.create_oval(610, 405, 615, 410, fill='black', tags='platypus')

move_butterfly()
move_platypus()
window.mainloop()