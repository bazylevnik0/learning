#include <stdio.h>
#include <string.h>

int main( int argc, char *argv[] )  
{
    char *search = argv[2];

    FILE *fp;
    fp = fopen(argv[1], "r");

    char str[100];
    while ( fgets (str, 100, fp) != NULL ) {
        char *result;
        result = strstr(str,search);

        if ( result ) {
            printf("%s",str);
        }
    }

    fclose(fp);
}