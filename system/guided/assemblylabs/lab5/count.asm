section .data
    filename db "test.txt",0
 
section .bss
    buffer resb 100     ; for maximum ~9 lines = 100 b
    answer resb 1

section .text
    global _start

_start:

    ; open textfile
    mov rax, 2          ; SYS_OPEN
    mov rdi, filename
    mov rsi, 0          ; O_RDONLY
    mov rdx, 0
    syscall
    
    ; read textfile
    push rax            ; push filedescriptor to stack
    mov rdi, rax        ; filedescriptor
    mov rax, 0          ; SYS_READ
    mov rsi, buffer
    mov rdx, 99         ; size of read
    syscall

    ; close textfile
    mov rax, 3          ; SYS_CLOSE
    pop rdi             ; pop filedescriptor from stack
    syscall

    ; count lines
    mov rax, 0          ; counter
    mov rbx, 0          ; iterator
    call count_lines

    ; print answer
    inc rax            ; add last line to counter
    mov r8, rax        ; store counter in temp
    add r8, 48         ; convert counter in temp to char
    mov [answer], r8   ; store counter from temp to answer
    mov rax, 1         ; SYS_WRITE
    mov rdi, 1         ; STD_OUT
    mov rsi, answer
    mov rdx, 2         ; count chars
    syscall

    ; exit
    mov rax, 60 ; sys_exit
    mov rdi, 0  ; error_code
    syscall

count_lines:
    mov r8b, byte[buffer + rbx] ; char from buffer to tempA
    inc rbx                     ; inc iterator
    cmp rbx, 100                ; itertor in end of buffer?
    je count_lines_quit         ; if yes then quit
    mov r9b, 10                 ; mov "\n" to tempB
    cmp r8b, r9b                ; tempA == tempB ? char == "\n" ?
    je inc_counter              ; if yes inc counter
    jmp count_lines             ; loop again

inc_counter:
    inc rax
    jmp count_lines

count_lines_quit:
    ret