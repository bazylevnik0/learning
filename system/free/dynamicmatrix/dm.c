#include <stdlib.h> 
#include <stdio.h>
#include <string.h>
#include <xcb/xcb.h>

//global variables(yep i know)
int i,j,k,o; //iterators
int sw,sh;//speed of movement

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
  xcb_gcontext_t       gcontext_black;
  xcb_generic_event_t *e;
  uint32_t             mask = 0;
  uint32_t             values[2];

  //Open the connection to the X server
  c = xcb_connect (NULL, NULL);
  // Get the first screen
  screen = xcb_setup_roots_iterator (xcb_get_setup (c)).data;
  sw = screen->width_in_pixels/16/10; //speed related to screen width
  sh = screen->width_in_pixels/9/10;  //speed related to screen height
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
  //blue
  rep = xcb_alloc_color_reply (c, xcb_alloc_color (c, cmap, 0, 0, 0), NULL);
  gcontext_black = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_GRAPHICS_EXPOSURES;
  values[0] = rep->pixel;
  values[1] = 0;
  xcb_create_gc (c, gcontext_black, win, mask, values);

  // Ask for our window's Id 
  win = xcb_generate_id(c);
  // Create the window
  mask = XCB_CW_BACK_PIXEL | XCB_CW_EVENT_MASK;
  values[0] = screen->black_pixel;
  values[1] = XCB_EVENT_MASK_EXPOSURE | XCB_EVENT_MASK_KEY_PRESS;
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


  //calculate and fill matrix with (x,y)
  for(j=0;j<9;j++)
  {
    for(i=0;i<16;i++)
    {
      matrix[j][i][0] = screen->width_in_pixels/16*i;
      matrix[j][i][1] = screen->height_in_pixels/9*j; 
    }
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
  
  //loop
  while ((e = xcb_wait_for_event (c))) {
    //handle
    switch (e->response_type & ~0x80) 
    {
      //keyboard
      case XCB_KEY_PRESS: {
        xcb_key_press_event_t *ev = (xcb_key_press_event_t *)e;
        
        //move
        //left
        if ( ev->detail == 113) 
        {
          for (j = 0; j < 9; j++)
          {
            for (i = 0; i < 16; i++)
            {
              matrix[j][i][0] -= sw;
            }
          }
        }
        //up
        if ( ev->detail == 116) 
        {
          for (j = 0; j < 9; j++)
          {
            for (i = 0; i < 16; i++)
            {
              matrix[j][i][1] += sh;
            }
          }
        }
        //right
        if ( ev->detail == 114) 
        {
          for (j = 0; j < 9; j++)
          {
            for (i = 0; i < 16; i++)
            {
              matrix[j][i][0] += sw;
            }
          }
        }
        //down
        if ( ev->detail == 111) 
        {
          for (j = 0; j < 9; j++)
          {
            for (i = 0; i < 16; i++)
            {
              matrix[j][i][1] -= sh;
            }
          }
        }  
        //top
        //handle right top border
        //right  
        if (matrix[0][15][0] > screen->width_in_pixels/16*16)
        {
          //shift right
          //store last(15) in temp
          int temp_array[9][5];
          for (j = 0; j < 9; j++)
          {
            for (k = 0; k < 5; k++)
            {
              temp_array[j][k] = matrix[j][15][k];
            }
          }
          //move all in matrix to right - exclude first(0)
          for (j = 0; j < 9; j++)
          {
            for (i = 15; i >= 1 ; i--)
            {
              for (k = 0; k < 5; k++)
              {
                matrix[j][i][k] = matrix[j][i-1][k]; 
              } 
              //fix         
              matrix[j][i][0] = matrix[j][i-1][0]+sw*10; 
            }  
          }
          //from temp to first(0)
          for(j = 0; j < 9; j++)
          {
            for (k = 0; k < 5; k++)
            {
              matrix[j][0][k] = temp_array[j][k];
            }
          }
          //recalculate matrix
          for( j = 0; j < 9; j++)
          {
            for( i = 1; i < 16; i++)
            {
              matrix[j][i][0] -= screen->width_in_pixels/16;
            }
          }
          for( j = 0; j < 9; j++)
          {
                             //width screen         
            matrix[j][0][0] -= screen->width_in_pixels; 
          }
        }
        //top 
        if (matrix[0][15][1] < 0)
        {
          //shift top
          //store first(0) in temp
          int temp_array[16][5];
          for (i = 0; i < 16; i++)
          {
            for (k = 0; k < 5; k++)
            {
              temp_array[i][k] = matrix[0][i][k];
            }
          }

          //move all in matrix to top - exclude last(8)
          for (j = 0; j <= 7; j++)
          {
            for (i = 0; i < 16 ; i++)
            {
              for (k = 0; k < 5; k++)
              {
                matrix[j][i][k] = matrix[j+1][i][k]; 
              }
              matrix[j][i][1] = matrix[j+1][i][1]-screen->height_in_pixels/9;  
            }
          }
          //from temp to last(8)
          for(i = 0; i < 16; i++)
          {
            for (k = 0; k < 5; k++)
            {
              matrix[8][i][k] = temp_array[i][k];
            }
          }
          
          //recalculate matrix
          for( j = 0; j <= 7; j++)
          {
            for( i = 0; i < 16; i++)
            {
              matrix[j][i][1] += screen->height_in_pixels/9;
            }
          }
          for( i = 0; i < 16; i++)
          {
                             //height screen         
            matrix[8][i][1] += screen->height_in_pixels; 
          }
        }

        //handle left bottom border
        //left  
        if (matrix[8][0][0] < 0)
        {
          //shift left
          //store first(0) in temp
          int temp_array[9][5];
          for (j = 0; j < 9; j++)
          {
            for (k = 0; k < 5; k++)
            {
              temp_array[j][k] = matrix[j][0][k];
            }
          }
          //move all in matrix to left - exclude first(0)
          for (j = 0; j < 9; j++)
          {
            for (i = 0; i <= 14 ; i++)
            {
              for (k = 0; k < 5; k++)
              {
                matrix[j][i][k] = matrix[j][i+1][k]; 
              } 
              //fix          
              matrix[j][i][0] = matrix[j][i+1][0]-sw*10; 
            }  
          }
          //from temp to last(15)
          for(j = 0; j < 9; j++)
          {
            for (k = 0; k < 5; k++)
            {
              matrix[j][15][k] = temp_array[j][k];
            }
          }
          //recalculate matrix
          for( j = 0; j < 9; j++)
          {
            for( i = 0; i <= 14; i++)
            {
              matrix[j][i][0] += screen->width_in_pixels/16;
            }
          }
          for( j = 0; j < 9; j++)
          {
                             //width screen         
            matrix[j][15][0] += screen->width_in_pixels; 
          }
        }
        //bottom
        if (matrix[8][0][1] > screen->height_in_pixels)
        {
          //shift bottom
          //store last(8) in temp
          int temp_array[16][5];
          for (i = 0; i < 16; i++)
          {
            for (k = 0; k < 5; k++)
            {
              temp_array[i][k] = matrix[8][i][k];
            }
          }

          //move all in matrix to bottom - exclude first(0)
          for (j = 8; j >= 1; j--)
          {
            for (i = 0; i < 16 ; i++)
            {
              for (k = 0; k < 5; k++)
              {
                matrix[j][i][k] = matrix[j-1][i][k]; 
              }
              matrix[j][i][1] = matrix[j-1][i][1]+screen->height_in_pixels/9;  
            }
          }
          //from temp to first(0)
          for(i = 0; i < 16; i++)
          {
            for (k = 0; k < 5; k++)
            {
              matrix[0][i][k] = temp_array[i][k];
            }
          }
          
          //recalculate matrix
          for( j = 8; j >= 1; j--)
          {
            for( i = 0; i < 16; i++)
            {
              matrix[j][i][1] -= screen->height_in_pixels/9;
            }
          }
          for( i = 0; i < 16; i++)
          {
                             //height screen         
            matrix[0][i][1] -= screen->height_in_pixels; 
          }
        }
               //nobreak i mean if we press button then after change we continue to drawing
      }
      //draw  
      case XCB_EXPOSE: {
        //clear screen
        xcb_rectangle_t rectangle[] = {
                  //x               y                width  height
                  {0, 0, screen->width_in_pixels*2,     screen->height_in_pixels*2},
                };
                //check color
                  xcb_poly_fill_rectangle (c, win, gcontext_black,   1, rectangle);
           
        //vertical lines
        for(i=0;i < 16; i++)
        {
          xcb_point_t line_temp[] = {
          //x              y
          {matrix[0][i][0],matrix[0][i][1]}, // a
          {matrix[8][i][0],matrix[8][i][1]}  // b
          };
          xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, line_temp);
        }
        //horizontal lines
        for(j=0;j < 9; j++)
        {
          xcb_point_t line_temp[] = {
          //x              y
          {matrix[j][0][0] ,matrix[j][0][1]}, // a
          {matrix[j][15][0],matrix[j][15][1]} // b
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
                xcb_arc_t  arc[] = {
                  //x             //fix center            y                                      width            height           angle in Binary Angle format
                  {matrix[j][i][0]+matrix[j][i][3]/2-o/2, matrix[j][i][1]+matrix[j][i][3]/2-o/2, matrix[j][i][3], matrix[j][i][3], 0, 360 << 6}
                };
                //check color
                if (matrix[j][i][4] == 1)
                {                        
                  xcb_poly_fill_arc (c, win, gcontext_red,   1, arc);
                }
                if (matrix[j][i][4] == 2)
                {
                  xcb_poly_fill_arc (c, win, gcontext_green, 1, arc);
                }
                if (matrix[j][i][4] == 3)
                {
                  xcb_poly_fill_arc (c, win, gcontext_blue,  1, arc);
                }
            }
            //square
            if(matrix[j][i][2] == 3)
            {
              printf("%d%d ",i,j);
              //try change this loop to polyfill
                xcb_rectangle_t rectangle[] = {
                  //x               y                width            height
                  {matrix[j][i][0], matrix[j][i][1], matrix[j][i][3], matrix[j][i][3]},
                };
                //check color
                if (matrix[j][i][4] == 1)
                {                        
                  xcb_poly_fill_rectangle (c, win, gcontext_red,   1, rectangle);
                }
                if (matrix[j][i][4] == 2)
                {
                  xcb_poly_fill_rectangle (c, win, gcontext_green, 1, rectangle);
                }
                if (matrix[j][i][4] == 3)
                {
                  xcb_poly_fill_rectangle (c, win, gcontext_blue,  1, rectangle);
                }
            }    
          }
        }

        //flush
        xcb_flush (c);
        
        break;
      }
      
    }
    
    // Free the Generic Event
    free (e);
  }

  return 0;
}