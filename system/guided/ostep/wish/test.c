#include <stdio.h> 
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() 
{
    char *argv_for_program_1[] = {"ls" , NULL};
    int pid_1 = fork();
    if (pid_1 == 0)
    {     
        execv("/usr/bin/ls" , argv_for_program_1); //print ls
    }
    char *argv_for_program_2[] = {"pwd" , NULL};
    int pid_2 = fork();
    if (pid_2 == 0)
    {     
        execv("/usr/bin/pwd" , argv_for_program_2); //print pwd
    }
    wait(0);
    wait(0);
    printf("continue\n");
}