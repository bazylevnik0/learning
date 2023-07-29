<b>Conception:</b>

You can store colorfull geometic shapes to display and move them with arrow-keys.<br>
This app have two sides: frontend and backend:<br>
 -frontend is X drawing with XCB lib<br>
 -backend is dynamic matrix<br>

Information of objects stores in 16x9 matrix(3-dimensianal array, 2 dimensions as a cell position and 1 dimension for store information of this cell).
In each cell stores real position(related to display), type and size; 
When you move object this is moving of whole matrix, each cell position information is changing to moving direction.
Also when matrix go out from display(when moving) - matrix is shifting like a infinity loop.
Redrawing is only when matrix moving or window is needed this.
Drawing - it is reading information from matrix and drawing with XCB functions.

<b>How to use:</b>
After building XCB lib and compiling app. Go to the folder and execute command in current format:<br>
---------------------//x,y,t,s,c;<br>
----for example: ./dm '2,3,c,1,r;5,5,s,2,g;'<br>
----where:<br>
--------x,y - relative position not real | 0 <= x <= 15 ; 0 <= y <= 9<br>
--------t - type<br>
------------c - circle<br>
------------s - square<br>
--------s - relative size not real<br>
--------c - color<br>
------------r - red<br>
------------g - green<br>
------------b - blue<br>
--------, - between arguments in object<br>
--------; - end of object<br>
Maximum 10 objects.<br>

Video presentation of example running: <a href="https://youtu.be/6PBQ6ptjNOY">https://youtu.be/6PBQ6ptjNOY</a><br>

<b>Install/Compile:</b><br>
This app need XCB lib(https://xcb.freedesktop.org/), if I am not mistaken you can compile in all platforms with X.<br>
First we need get XCB: https://xcb.freedesktop.org/dist/<br>
Second we need build XCB: ttps://xcb.freedesktop.org/DevelopersGuide/<br>
Then you can use your compilator but for gcc use this command string:<br>
gcc dm.c -o dm `pkg-config --cflags --libs xcb` <br>
