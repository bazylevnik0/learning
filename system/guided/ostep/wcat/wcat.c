#include <stdio.h>

int main( int argc, char *argv[] )  
{
    FILE * fp;
    fp = fopen(argv[1], "r");
   
    int c;
    while (c != EOF){
        c = fgetc(fp);
        printf("%c", c);
    }

    fclose(fp);
    return 0;
}