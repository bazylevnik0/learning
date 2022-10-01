#include <stdio.h>
#include <string.h>

int main( int argc, char *argv[] ) 
{
    FILE *fp;
    fp = fopen(argv[1], "r");

    char buffer[10000];
    char str[1000];
    while ( fgets (str, 1000, fp) != NULL ) {
        char temp[10];
        int i = 0;
        int count = 1;
        char c = str[0];
        while ( c != '\0' ) {
            char prev = c;
            i++;
            c = str[i];
            
            if ( c != prev ) {
                sprintf(temp, "%d", count);
                char prev_str[2];
                prev_str[0] = prev;
                prev_str[1] = '\0';
                strcat(temp, prev_str);
                strcat(buffer, temp);
                count = 1;
                temp[0]= '\0';
            }
            else {
                count++;
            }
        }
    }
    fwrite(buffer , 4 , sizeof(buffer) , stdout );
    fclose(fp);
    return 0;
}