#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
#include <errno.h>

#define ISVALIDSOCKET(s) ((s) >= 0)
#define CLOSESOCKET(s) close(s)
#define SOCKET int
#define GETSOCKETERRNO() (errno)

#include <stdio.h>
#include <string.h>
#include <time.h>

#include <pthread.h>

void *loop();
static SOCKET socket_listen;
int main() {

    printf("Configuring local address...\n");
    struct addrinfo hints;
    memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;

    struct addrinfo *bind_address;
    getaddrinfo(0, "8080", &hints, &bind_address);


    printf("Creating socket...\n");
    //static SOCKET socket_listen;
    socket_listen = socket(bind_address->ai_family,
            bind_address->ai_socktype, bind_address->ai_protocol);
    if (!ISVALIDSOCKET(socket_listen)) {
        fprintf(stderr, "socket() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }


    printf("Binding socket to local address...\n");
    if (bind(socket_listen,
                bind_address->ai_addr, bind_address->ai_addrlen)) {
        fprintf(stderr, "bind() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }
    freeaddrinfo(bind_address);


    printf("Listening...\n");
    if (listen(socket_listen, 10) < 0) {
        fprintf(stderr, "listen() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }

    while(1)
    {
        pthread_t thread_id;
        pthread_create(&thread_id, NULL, loop, NULL);    
        pthread_join(thread_id, NULL);
    }
 
    CLOSESOCKET(socket_listen);

    return 0;
}

void *loop() {
        struct sockaddr_storage client_address;
        socklen_t client_len = sizeof(client_address);
        SOCKET socket_client = accept(socket_listen,
                (struct sockaddr*) &client_address, &client_len);
        if (!ISVALIDSOCKET(socket_client)) {
            fprintf(stderr, "accept() failed. (%d)\n", GETSOCKETERRNO());
            //return 1;
        }

        char request[1024];
        int bytes_received = recv(socket_client, request, 1024, 0);
        char *path = request + 4;
        path = strtok(path, " ");
        if (strcmp(path, "/") == 0) path = "/index.html";
        char response[10000] =
            "HTTP/1.1 200 OK\r\n"
            "Connection: close\r\n"
            "Content-Length: 10000\r\n"
            "Content-Type: text/html\r\n\r\n";
        if (strcmp(path, "/index.html") == 0)
        {
            FILE *fp = fopen("index.html", "rb");
            char buffer[10000];
            fread(buffer, 1, 10000, fp);
            fclose(fp);
            strcat(response, buffer);
            send(socket_client, response, strlen(response), 0);
            memset(buffer, 0, sizeof(buffer));     
        }
        else if (strcmp(path, "/test1.html") == 0)
        {
            FILE *fp = fopen("test1.html", "rb");
            char buffer[10000];
            fread(buffer, 1, 10000, fp);
            fclose(fp);
            strcat(response, buffer);
            send(socket_client, response, strlen(response), 0);   
            memset(buffer, 0, sizeof(buffer));  
        }
        else if (strcmp(path, "/test2.html") == 0)
        {
            FILE *fp = fopen("test2.html", "rb");
            char buffer[10000];
            fread(buffer, 1, 10000, fp);
            fclose(fp);
            strcat(response, buffer);
            send(socket_client, response, strlen(response), 0);    
            memset(buffer, 0, sizeof(buffer)); 
        }
        else
        {
            char *bad =  "Bad Request";
            strcat(response, bad);
            send(socket_client, response, strlen(response), 0);
        }

        memset(response, 0, sizeof(response));
        CLOSESOCKET(socket_client);

}