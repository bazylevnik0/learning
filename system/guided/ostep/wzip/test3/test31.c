#include <stdio.h>
#include <string.h>

int main( int argc, char *argv[] ) 
{
    FILE *fp;
    fp = fopen("test3out.txt", "r");

    char buffer[1000];
    fread(buffer, 4, 100, fp);
    printf("%s\n", buffer);
}