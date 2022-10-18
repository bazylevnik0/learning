section .bss
    string resb 100   ; store string
    buffer resb 100   ; store string

section .text
    global _start

_start:
    ; read string
    mov rax, 0   ; sys_read
    mov rdi, 0   ; fd stdout
    mov rsi, string
    mov rdx, 100 ; count chars
    syscall
   
    ; send string to buffer
    mov rsi, string
    mov rdi, buffer
    mov r9, 0         ; counter A
    call loop_in
    ; get string from buffer in reverse order
    mov rsi, string
    mov rdi, buffer
    mov r10, 0        ; counter B
    call loop_out
    ;add new line char to string
    inc r10
    mov al, 10
    mov [rsi + r10], al

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

loop_in:
    cmp al, 0
    je loopquit
    mov al, [rsi]
    mov [rdi] , al
    inc rsi
    inc rdi
    inc r9
    jmp loop_in

loop_out:
    mov al, [rdi + r9]
    mov [rsi + r10], al
    cmp r9, 0
    je loopquit
    inc r10
    dec r9
    jmp loop_out

loopquit:
    ret