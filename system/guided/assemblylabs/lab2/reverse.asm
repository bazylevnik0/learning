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

    ;mov rax, [string]
    ;push rax
    ;inc rax
    ;push rax
    ;inc rax
  
    ;mov rbx, string
    ;pop rax
    ;mov byte[rbx + 0],al
    ;pop rax
    ;mov byte[rbx + 1],al
    
    ; push to stack
    mov rax, [string]
    mov r9, 0
    call _loop_in

    ; pop from stack
    ;mov rbx, string
    ;mov r10, 0
    ;call _loop_out

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
    cmp al, 0
    je _loopquit
    push rax
    inc rax
    inc r9
    jmp _loop_in

_loop_out:
    cmp r9, 0
    je _loopquit
    pop rax
    mov byte[rbx + r10],al
    dec r9
    inc r10
    jmp _loop_out

_loopquit:
    ret