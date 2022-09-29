#include <stdio.h> 
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() {
    char *line;
    size_t line_size = 100;
    line = malloc(line_size);
    do 
    {
      printf("%s", "wish> ");
      getline(&line,&line_size,stdin);
      if (strcmp(line, "exit\n") != 0) {
        line[strcspn(line, "\n")] = 0;

        char *argv_for_program[10];
        char separator[2] = " ";
        
        char *found_redirection = strchr(line, '>');
        char *found_parallel = strchr(line, '&');
        if ( found_redirection || found_parallel ) {
          if ( found_redirection ) {
            char *name_of_program;
            name_of_program = strtok(line, separator);
            char *temp;
            temp = strtok(NULL, separator);
            char *name_of_file;
            name_of_file = strtok(NULL, separator);

            char path[100] = "/usr/bin/";
            strcat(path, name_of_program);
            argv_for_program[0] = name_of_program;
            argv_for_program[1] = NULL;
            
            int pid = fork();
            if (pid == 0)
            {     
              int fd = open(name_of_file, O_RDWR | O_CREAT, S_IRUSR | S_IWUSR);
              dup2(fd, 1);
              close(fd);  
              int check = execv(path , argv_for_program);
              printf("%d\n",check);
              wait(0);
            }
          }
          if ( found_parallel ) {
            char *name_of_program_1;
            name_of_program_1 = strtok(line, separator);
            char *temp;
            temp = strtok(NULL, separator);
            char *name_of_program_2;
            name_of_program_2 = strtok(NULL, separator);

            char path_1[100] = "/usr/bin/";
            strcat(path_1, name_of_program_1);
            char path_2[100] = "/usr/bin/";
            strcat(path_2, name_of_program_2);
            
            argv_for_program[0] = name_of_program_1;
            argv_for_program[1] = NULL;
            int pid_1 = fork();
            if (pid_1 == 0)
            {     
              int check = execv(path_1 , argv_for_program);
              printf("%d\n",check);
            }
            argv_for_program[0] = name_of_program_2;
            argv_for_program[1] = NULL;
            int pid_2 = fork();
            if (pid_2 == 0)
            {     
              int check = execv(path_2 , argv_for_program);
              printf("%d\n",check);
            }
            wait(0);
            wait(0);
          }
        } else {
          char *name_of_program;
          name_of_program = strtok(line, separator);
          
          char *arg;
            argv_for_program[1] = arg;
          size_t arg_size = 20;
          if (strcmp(name_of_program, "cd") == 0) {
            arg = strtok(NULL, separator);
            chdir(argv_for_program[1]);
          } else {
            argv_for_program[0] = name_of_program;
            arg = malloc(20); 
            int i = 1;
            while( arg != NULL ) {
              arg = strtok(NULL, separator);
              argv_for_program[i] = arg;
              i++;
            }
            free(arg);

            char path[100] = "/usr/bin/";
            strcat(path, name_of_program);
            
            int pid = fork();
            if (pid == 0)
            {     
              int check = execv(path , argv_for_program);
              printf("%d\n",check);
            }
            wait(0);
          }
        }
      }
    } while (strcmp(line, "exit\n") != 0);

    free(line);
}