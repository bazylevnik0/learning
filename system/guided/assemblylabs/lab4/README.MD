X86_X64<br>
NASM<br>
Ubuntu<br><br>

Write a game "Space Invaders".<br><br>

nasm -f elf64 -F dwarf -g test.asm<br>
gcc -o test test.o -lncurses 