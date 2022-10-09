section .bss
    string resb 100   ; store string

section .text
    global _start

_start:
    ; read string
    mov rax, 0   ; sys_read
    mov rdi, 0   ; fd stdout
    mov rsi, string
    mov rdx, 100 ; count chars
    syscall

    ;
    ;mov rax, 0
    ;call _loop_in

    ; print string
    mov rax, 1  ; sys_write
    mov rdi, 1  ; fd stdout
    mov rsi, string
    mov rdx, 100 ; count chars
    syscall

    ; exit
    mov rax, 60 ; sys_exit
    mov rdi, 0  ; error_code
    syscall

_loop_in:
   mov rbx, [string + rax]
   cmp rbx, 0
   je _loopquit
   push rbx
   inc rax
   jmp _loop_in

_loopquit:
    ret