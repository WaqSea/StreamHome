import sys
import termios
import tty
import select

def getch():
    fd = sys.stdin.fileno()
    old = termios.tcgetattr(fd)
    try:
        tty.setraw(fd)
        ch = sys.stdin.read(1)
        seq = [ch]
        while True:
            r, _, _ = select.select([sys.stdin], [], [], 0.05)
            if r:
                seq.append(sys.stdin.read(1))
            else:
                break
        return "".join(seq)
    finally:
        termios.tcsetattr(fd, termios.TCSANOW, old)

print("Press any key (like Arrow Keys) to see its raw representation. Press Ctrl+C to exit.")
try:
    while True:
        key = getch()
        print(f"Key: {repr(key)}")
except KeyboardInterrupt:
    print("\nExiting.")
