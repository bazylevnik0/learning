#include <stdio.h>
#include <string.h>

int main( int argc, char *argv[] ) 
{
    FILE *fp;
    fp = fopen(argv[1], "r");

    char str[100];
    fgets (str, 100, fp);

    fwrite(str , 4 , sizeof(str) , stdout );
}

