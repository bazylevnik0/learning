nasm -f elf64 -F dwarf -g file.asm
ld -m elf_x86_64 -o file file.o

gcc -static -o file file.o !вместо _start - main