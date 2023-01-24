#include <stdlib.h> 
#include <stdio.h>
#include <string.h>
#include <xcb/xcb.h>

//global variables(yep i know)
int i,j,k,o; //iterators

int
main (int argc, char *argv[])
{
  
  //parse
  //check existing of argument
  if ( argc != 2 )
  {
    //if no arguments then print message with rules
    printf("%s","Please use correct input:\n");
    printf("%s","                   x,y,t,s,c;x,y,t,s,c;\n");
    printf("%s","for example: ./dm '2,3,c,1,r;5,5,s,2,g;'\n");
    printf("%s","where:\n");
    printf("%s","       x,y - relative position | 0 <= x <= 15 ; 0 <= y <= 9\n");
    printf("%s","       t - type'\n");
    printf("%s","           c - circle\n");
    printf("%s","           s - square\n");
    printf("%s","       s - relative size\n");
    printf("%s","           r - red\n");
    printf("%s","           g - green\n");
    printf("%s","           b - blue\n");
    printf("%s","       , - between parameters in object\n");
    printf("%s","       ; - ends of objects\n");
    printf("%s","maximum 10 objects...\n");
    return 0;
  }
  //read argument and store in temp_objects
  char *temp_objects[10];
  int length_objects;
  char *temp_argument = argv[1];
  char *token = strtok(temp_argument, ";");
  i = 0;
  do
  {
    temp_objects[i] = token;
    i++;
  }
  while (token = strtok(NULL, ";")); //this cycle from https://www.ibm.com/docs/en/i/7.4?topic=functions-strtok-tokenize-string
                      // (-1) fix last iteration, i mean we store this from read loop(count objects)
  length_objects = i - 1; 
  //convert each from temp_objects to objects
  //                                         with rules:
                                                      //type  c = 2
                                                      //type  s = 3
                                                      //color r = 1
                                                      //color g = 2
                                                      //color b = 3
  int objects[10][5];
  for (i= length_objects ; i>=0 ; i--)
  {
    token = strtok(temp_objects[i], ",");
    for (j=0 ; j<5 ; j++)
    {
      if      (!strcmp(token,"1")) objects[i][j] = 1;
      else if (!strcmp(token,"2")) objects[i][j] = 2;
      else if (!strcmp(token,"3")) objects[i][j] = 3;
      else if (!strcmp(token,"c")) objects[i][j] = 2;
      else if (!strcmp(token,"s")) objects[i][j] = 3;
      else if (!strcmp(token,"r")) objects[i][j] = 1;
      else if (!strcmp(token,"g")) objects[i][j] = 2;
      else if (!strcmp(token,"b")) objects[i][j] = 3;
      else objects[i][j] = atoi(token);
      token = strtok(NULL, ",");
    }  
  }

  //initialization
  int matrix[9][16][5];
  for (i=0 ; i<9 ; i++)
  {
    for (j=0 ; j<16 ; j++)
    {
       for (k=0 ; k<5 ; k++)
       {
         matrix[i][j][k] = 0;
       } 
    }
  }
  
  //xcb context
  xcb_connection_t    *c;
  xcb_screen_t        *screen;
  xcb_drawable_t       win;
  xcb_gcontext_t       gcontext_white;
  xcb_gcontext_t       gcontext_red;
  xcb_gcontext_t       gcontext_green;
  xcb_gcontext_t       gcontext_blue;
  xcb_generic_event_t *e;
  uint32_t             mask = 0;
  uint32_t             values[2];

  //Open the connection to the X server
  c = xcb_connect (NULL, NULL);
  // Get the first screen
  screen = xcb_setup_roots_iterator (xcb_get_setup (c)).data;
  // Create graphic contexts
  xcb_colormap_t           cmap;
  xcb_alloc_color_reply_t *rep;
  win = screen->root;
  cmap = screen->default_colormap;
  //white
  gcontext_white = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_GRAPHICS_EXPOSURES;
  values[0] = screen->white_pixel;
  values[1] = 0;
  xcb_create_gc (c, gcontext_white, win, mask, values);
  //red
  rep = xcb_alloc_color_reply (c, xcb_alloc_color (c, cmap, 65535, 0, 0), NULL);
  gcontext_red = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_GRAPHICS_EXPOSURES;
  values[0] = rep->pixel;
  values[1] = 0;
  xcb_create_gc (c, gcontext_red, win, mask, values);
  //green
  rep = xcb_alloc_color_reply (c, xcb_alloc_color (c, cmap, 0, 65535, 0), NULL);
  gcontext_green = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_GRAPHICS_EXPOSURES;
  values[0] = rep->pixel;
  values[1] = 0;
  xcb_create_gc (c, gcontext_green, win, mask, values);
  //blue
  rep = xcb_alloc_color_reply (c, xcb_alloc_color (c, cmap, 0, 0, 65535), NULL);
  gcontext_blue = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_GRAPHICS_EXPOSURES;
  values[0] = rep->pixel;
  values[1] = 0;
  xcb_create_gc (c, gcontext_blue, win, mask, values);

  // Ask for our window's Id 
  win = xcb_generate_id(c);
  // Create the window
  mask = XCB_CW_BACK_PIXEL | XCB_CW_EVENT_MASK;
  values[0] = screen->black_pixel;
  values[1] = XCB_EVENT_MASK_EXPOSURE;
  xcb_create_window (c,                             // Connection          
                     XCB_COPY_FROM_PARENT,          // depth               
                     win,                           // window Id           
                     screen->root,                  // parent window       
                     0, 0,                          // x, y                
                     screen->width_in_pixels, screen->height_in_pixels, // width, height       
                     10,                            // border_width        
                     XCB_WINDOW_CLASS_INPUT_OUTPUT, // class               
                     screen->root_visual,           // visual              
                     mask, values);                 // masks 
  // Map the window on the screen 
  xcb_map_window (c, win);
  // We flush the request 
  xcb_flush (c);


  //calculate and fill borders in matrix
  //horizontal
  for (j=0 ; j<16 ; j++)
  {
    //up
    //x
    matrix[0][j][0] = screen->width_in_pixels/16*j;
    //y
    matrix[0][j][1] = screen->height_in_pixels/9*0;
    //type
    matrix[0][j][2] = 1;
    //down
    //x
    matrix[8][j][0] = screen->width_in_pixels/16*j;
    //y
    matrix[8][j][1] = screen->height_in_pixels/9*8;
    //type
    matrix[8][j][2] = 1;
  }
  //vertical
  for (i=0 ; i<9 ; i++)
  {
    //left
    //x
    matrix[i][0][0] = screen->width_in_pixels/16*0;
    //y
    matrix[i][0][1] = screen->height_in_pixels/9*i;
    //type
    matrix[i][0][2] = 1;
    //right
    //x
    matrix[i][15][0] = screen->width_in_pixels/16*15;
    //y
    matrix[i][15][1] = screen->height_in_pixels/9*i;
    //type
    matrix[i][15][2] = 1;
  }

  //calculate and fill objects in matrix
  for( i = length_objects; i >= 0; i--)
  {
    //     x              y              x                                          x
    matrix[objects[i][1]][objects[i][0]][0] = screen->width_in_pixels/16*objects[i][0];
    //     x              y              y                                          y
    matrix[objects[i][1]][objects[i][0]][1] = screen->height_in_pixels/9*objects[i][1];
    //     x              y              t               t
    matrix[objects[i][1]][objects[i][0]][2] = objects[i][2];
    //     x              y              s               s
    matrix[objects[i][1]][objects[i][0]][3] = objects[i][3];
    //     x              y              c               c
    matrix[objects[i][1]][objects[i][0]][4] = objects[i][4];
  }

  //test printing
  for (i=0 ; i<9 ; i++)
  {
    for (j=0 ; j<16 ; j++)
    {
       for (k=0 ; k<5 ; k++)
       {
         printf("%d",matrix[i][j][k]);
       } 
      printf(" ");
    }
    printf("\n");
  }


  
  //loop
  while ((e = xcb_wait_for_event (c))) {
    //handle
    switch (e->response_type & ~0x80) {
    //draw  
    case XCB_EXPOSE: {
      //x lines
      for(j=0;j < 16; j++)
      {
        xcb_point_t line_temp[] = {
        //x              y
        {matrix[0][j][0],matrix[0][j][1]}, // a
        {matrix[8][j][0],matrix[8][j][1]}  // b
        };
        xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, line_temp);
      }
      //y lines
      for(i=0;i < 9; i++)
      {
        xcb_point_t line_temp[] = {
        //x              y
        {matrix[i][0][0] ,matrix[i][0][1]}, // a
        {matrix[i][15][0],matrix[i][15][1]} // b
        };
        xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, line_temp);
      }
      //objects
      for( j=0; j < 9; j++)
      {
        for( i=0; i < 16; i++)
        {
          //check type
          //ark
          if(matrix[j][i][2] == 2)
          {
            printf("%d%d ",i,j);
            for (o = 0; o < matrix[j][i][3]; o += 1) //loop for fill shape
            {
              xcb_arc_t  arc[] = {
                //x             //fix center            y                              width  height  angle in Binary Angle format
                {matrix[j][i][0]+matrix[j][i][3]/2-o/2, matrix[j][i][1]+matrix[j][i][3]/2-o/2, o,     o,      0, 360 << 6}
              };
              //check color
              if (matrix[j][i][4] == 1)
              {                        
                xcb_poly_arc (c, win, gcontext_red,   1, arc);
              }
              if (matrix[j][i][4] == 2)
              {
                xcb_poly_arc (c, win, gcontext_green, 1, arc);
              }
              if (matrix[j][i][4] == 3)
              {
                xcb_poly_arc (c, win, gcontext_blue,  1, arc);
              }
            }
          }
          //square
          if(matrix[j][i][2] == 3)
          {
            printf("%d%d ",i,j);
            for (o = 0; o < matrix[j][i][3]; o += 1) //loop for fill shape
            {
              xcb_rectangle_t rectangle[] = {
                //x               y                width  height
                {matrix[j][i][0], matrix[j][i][1], o,     o},
              };
              //check color
              if (matrix[j][i][4] == 1)
              {                        
                xcb_poly_rectangle (c, win, gcontext_red,   1, rectangle);
              }
              if (matrix[j][i][4] == 2)
              {
                xcb_poly_rectangle (c, win, gcontext_green, 1, rectangle);
              }
              if (matrix[j][i][4] == 3)
              {
                xcb_poly_rectangle (c, win, gcontext_blue,  1, rectangle);
              }
            }
          }    
        }
      }


      //types/objects for geometric shapes 
      /*
      xcb_point_t line_temp[] = {
      //x,y
        {0,0}, // a
        {100,100}  // b
      };
      */ 
      /*
      xcb_rectangle_t rectangle[] = {
      //x  y  width height
        {0, 0, 0,    0},
      }; 
      xcb_arc_t  arc[] = {
      //x  y  width  height  angle in Binary Angle format
        {0, 0, 0,     0,      0, 360 << 6}
      };
      */
      /*
      for (j=0 ; j<16 ; j++)
      {

      }
      */
     
      /*
      //draw lines
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineA);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineB);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineC);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineD);

      //draw rectangle
      xcb_poly_rectangle (c, win, gcontext_red, 1, rectangle);

      //draw arc
      xcb_poly_arc (c, win, gcontext_blue, 1, arc);
      */



      //flush
      xcb_flush (c);

      break;
    }
    //keyboard
    case XCB_KEY_PRESS: {
      xcb_key_press_event_t *ev = (xcb_key_press_event_t *)e;
      
      printf ("%ld pressed in window %ld\n",
              ev->detail,ev->event);
      break;
    }
    default: {
      // Unknown event type, ignore it
      break;
    }
    }
    // Free the Generic Event
    free (e);
  }

  return 0;
}