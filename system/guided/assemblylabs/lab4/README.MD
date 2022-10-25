Write a game "Space Invaders".

nasm -f elf64 -F dwarf -g test.asm
gcc -o test test.o -lncurses 