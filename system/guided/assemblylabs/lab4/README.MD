Write a game "Space Invaders".

gcc -S test.c -lncurses
gcc test.c -o test -lncurses

nasm -f elf64 -F dwarf -g test.asm
gcc -o test test.o -lncurses 