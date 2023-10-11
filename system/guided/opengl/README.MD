based on tutorials and exercises: https://learnopengl.com/ <br>
gcc $( pkg-config --cflags gtk4 ) -o example example.c $( pkg-config --libs gtk4 epoxy) -lm<br>