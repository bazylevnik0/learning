X86_X64<br>
NASM<br>
Ubuntu<br><br>

Write a programm "Hello, world!".<br><br>

nasm -f elf64 -F dwarf -g file.asm <br>
ld -m elf_x86_64 -o file file.o
