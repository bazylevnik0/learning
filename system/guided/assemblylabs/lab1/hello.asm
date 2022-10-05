section .data
    text db "Hello, world!",10

section .text
    global _start

_start:
    mov rax, 1  ; sys_write
    mov rdi, 1  ; fd stdout
    mov rsi, text
    mov rdx, 14 ; count chars
    syscall

    mov rax, 60 ; sys_exit
    mov rdi, 0  ; error_code
    syscall
