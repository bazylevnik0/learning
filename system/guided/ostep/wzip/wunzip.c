#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main( int argc, char *argv[] ) 
{
    FILE *fp;
    fp = fopen(argv[1], "r");

    char buffer[10000];
    fread(buffer, 4, 1000, fp);
    
    int i = 0;
    char c = buffer[0];
    while ( c != '\0' ) {
        char temp[10];
        temp[0]='\0';
        c = buffer[i];
        if ( isdigit(c) ) {
            while ( isdigit(c) ){
                char temp_buf[2];
                temp_buf[0] = c;
                temp_buf[1] = '\0';
                strcat(temp, temp_buf);
                i++;
                c = buffer[i];
            }
        }

        
        int mult = *temp - '0';
        for ( int j = 0; j < mult; j++){
            putchar(c);
        }

        i++;
    }

    fclose(fp);
    return 0;
}