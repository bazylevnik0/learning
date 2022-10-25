extern initscr, endwin, getch, printw, noecho, clear

section .bss
    position resq 1
    map      resq 1
    score    resq 1

section .data
    rules db 'Press any key to continue...',10,'Z - move to left',10,'C - move to right',10,'X - fire!',0
    map4      db '______ ______ ______',10,'------ ------ ------',10,'------ ------ ------',10,10,'000000 ------ 000000',10,'0-00-0 ------ 0-00-0',10,'000000 ------ 000000',10,0 
    map3      db '______ ______ ______',10,'------ ------ ------',10,'------ ------ ------',10,10,'------ ------ ------',10,'------ ------ ------',10,'------ ------ ------',10,0 
    map2      db '______ ______ ______',10,'------ ------ ------',10,'------ ------ ------',10,10,'000000 ------ ------',10,'0-00-0 ------ ------',10,'000000 ------ ------',10,0 
    map1      db '______ ______ ______',10,'------ ------ ------',10,'------ ------ ------',10,10,'------ ------ 000000',10,'------ ------ 0-00-0',10,'------ ------ 000000',10,0 
    position0 db '------ ------ ------',10,'------ ------ ------',10,'------ ------ ------',10,10,'--**-- ------ ------',10,'-****- ------ ------',10,'****** ****** ******',10,0 
    position1 db '------ ------ ------',10,'------ ------ ------',10,'------ ------ ------',10,10,'------ --**-- ------',10,'------ -****- ------',10,'****** ****** ******',10,0 
    position2 db '------ ------ ------',10,'------ ------ ------',10,'------ ------ ------',10,10,'------ ------ --**--',10,'------ ------ -****-',10,'****** ****** ******',10,0 
   
section .text
    global main
    
main:
    ; set start config
    mov rbx, 1
    mov [rel position], rbx
    mov rbx, 4
    mov [rel map], rbx
    mov rbx, 0
    mov [rel score], rbx

    push rax                  ; fix stack align

    call initscr wrt ..plt    ; init screen
    call noecho wrt ..plt     ; no echo mod

    ; print rules
    push rax                  ; fix stack align
    call print_rules
    push rax
    call getch wrt ..plt      ; wait press any key

    push rax                  ; fix stack align
    call game_loop

game_loop:
    call clear wrt ..plt   ; clear screen
    
    push rax
    call print_game_screen
    push rax

    call getch wrt ..plt      ; wait press any key    
    cmp rax, 113              ; key = q ?
    je game_loop_quit         ; if iterator = q then quit from loop else:
    cmp rax, 122              ; key = z ?
    je set_position_left      ; if iterator = z then set position -1
    cmp rax, 99               ; key = c ?
    je set_position_right     ; if iterator = c then set position +1
    cmp rax, 120              ; key = x ?
    je set_fire               ; if iterator = c then set position +1

    jmp game_loop

game_loop_quit:
    call endwin  wrt ..plt    ; end screen

    ; exit
    mov rax, 60 ; sys_exit
    mov rdi, 0  ; error_code
    syscall

set_position_left:
    mov rbx, [rel position]
    dec rbx 
    mov [rel position],rbx
    jmp game_loop 

set_position_right:
    mov rbx, [rel position]
    inc rbx 
    mov [rel position],rbx
    jmp game_loop 

set_fire:
    mov rbx, [rel score]
    cmp rbx, 0
    je set_fire_0
    cmp rbx, 1
    je set_fire_1

    jmp game_loop

set_fire_0:
    mov rbx, [rel position]
    cmp rbx, 0
    je set_fire_0_0
    cmp rbx, 2
    je set_fire_0_2
    jmp game_loop

set_fire_0_0:
    mov rbx, [rel score]
    inc rbx
    mov [rel score], rbx

    mov rbx, 1
    mov [rel map], rbx
    jmp game_loop

set_fire_0_2:
    mov rbx, [rel score]
    inc rbx
    mov [rel score], rbx

    mov rbx, 2
    mov [rel map], rbx
    jmp game_loop

set_fire_1:
    mov rbx, [rel map]
    cmp rbx, 1
    je set_fire_1_1
    cmp rbx, 2
    je set_fire_1_2
    jmp game_loop

set_fire_1_end:
    mov rbx, [rel score]
    inc rbx
    mov [rel score], rbx

    mov rbx, 3
    mov [rel map], rbx
    jmp game_loop

set_fire_1_1:
    mov rbx, [rel position]
    cmp rbx, 2
    je set_fire_1_end
    jmp game_loop

set_fire_1_2:
    mov rbx, [rel position]
    cmp rbx, 0
    je set_fire_1_end
    jmp game_loop

print_game_screen:
    ;print map
    mov rbx, [rel map]
    cmp rbx, 4
    je print_map4
    cmp rbx, 3
    je print_map3
    cmp rbx, 2
    je print_map2
    cmp rbx, 1
    je print_map1
    ret

print_position:
    mov rbx, [rel position]
    cmp rbx, 2
    je print_position2
    cmp rbx, 1
    je print_position1
    cmp rbx, 0
    je print_position0
    ret

print_rules:
    mov rdi, rules
    call printw wrt ..plt 
    ret

print_map4:
    mov rdi, map4
    call printw wrt ..plt
    jmp print_position

print_map3:
    mov rdi, map3
    call printw wrt ..plt
    jmp print_position

print_map2:
    mov rdi, map2
    call printw wrt ..plt
    jmp print_position

print_map1:
    mov rdi, map1
    call printw wrt ..plt
    jmp print_position

print_position0:
    mov rdi, position0
    call printw wrt ..plt
    ret

print_position1:
    mov rdi, position1
    call printw wrt ..plt
    ret

print_position2:
    mov rdi, position2
    call printw wrt ..plt
    ret