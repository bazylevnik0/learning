<b>Description:</b><br>
GTK app for visualization 3D-effect(isometric) with 2D drawing area widget. <br>
You can rotate parallelepiped or icosahedron through vertical and horizontal axises.<br>

<b>How to use:</b><br>
Video presentation: <a href="https://youtu.be/l9CoahA5O-c">https://youtu.be/l9CoahA5O-c</a><br>
After install GTK lib you can compile this app and then launch it, for example: <b>./ir</b>

<b>Conception:</b><br>
Shapes are vertices, and drawing with lines between this vertices.<br>
All vertices stores in matrix [x,y,z] - for drawing we making projection to drawing matrix[x,z].<br>
Rotating of matrix realised with trigonometry formules.<br>

<b>Compile/Install</b><br>
First we need install GTK: <a href="https://www.gtk.org/docs/installations/index">https://www.gtk.org/docs/installations/index</a><br>
Then we can compile app, for example with gcc:<br>
<b>gcc $(pkg-config --cflags gtk4) -o ir ir.c $(pkg-config --libs gtk4) -lm</b>