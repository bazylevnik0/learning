extern scanf
extern printf
extern exit
extern fflush

section .bss               
    num resb 4
    
section .data                              
    formatd: db "%d", 0
    string_rules db 'Enter five nums(one per string):',10 ,0  
    string_answer db 'Answer is: %f',10,0
    array db 0, 0, 0, 0, 0

section .text
    global main
    

main:
    call print_rules

    mov rbx, 0          ; iterator
    call read

    mov rax, 0
    mov [num], rax
    mov rbx, 0          ; iterator
    call calc
   
    call print_answer 

    ;exit
    xor edi, edi                ; RDI=0: all streams
    call fflush
    mov rax, 60 ; sys_exit
    mov rdi, 0  ; error_code
    syscall

print_rules:
    mov rdi, string_rules 
    call printf     
    ret

read:
    cmp rbx, 5                  ; iterator = 5 ?
    je read_quit                ; if iterator = 5 then quit from loop else:
    
    mov al, 0 
    lea rdi, [formatd]
	lea rsi, [array + rbx*4]
    call scanf

    inc rbx                     ; iterator++
    jmp read

read_quit:
    ret

calc:
    cmp rbx, 5                  ; iterator = 5 ?
    je calc_quit                ; if iterator = 5 then quit from loop else:

    mov rax, [num]
    mov rcx, [array + rbx*4]
    add rax, rcx
    mov [num], rax

    inc rbx                     ; iterator++
    jmp calc

calc_quit:
    mov eax, [num]
    cvtsi2sd xmm0, eax
    mov ecx, 5
    cvtsi2sd xmm1, ecx
    divsd xmm0, xmm1
    movsd [num], xmm0 
    ret

 print_answer:
    mov rdi, string_answer 
    movsd xmm0, [num]    
    mov al,1  
    call printf    
    ret