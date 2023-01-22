#include <stdlib.h> 
#include <stdio.h>
#include <xcb/xcb.h>

int
main ()
{
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

  //lines
  xcb_point_t          lineA[] = {
    {10 ,10},
    {10 ,100}
  };
  xcb_point_t          lineB[] = {
    {50 ,10},
    {50 ,100}
  };
  xcb_point_t          lineC[] = {
    {10 ,10},
    {100,10}
  };
  xcb_point_t          lineD[] = {
    {10 ,50},
    {100,50}
  };  

  //rectangle
  xcb_rectangle_t      rectangle[] = {
    { 75, 75, 25, 25},
  };  

  //arc
  xcb_arc_t            arc[] = {
                              // binary angular
    {100, 100, 25, 25, 0, 360 << 6}
  };

  /* Open the connection to the X server */
  c = xcb_connect (NULL, NULL);

  /* Get the first screen */
  screen = xcb_setup_roots_iterator (xcb_get_setup (c)).data;

  /* Create graphic contexts */
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


  /* Ask for our window's Id */
  win = xcb_generate_id(c);

  /* Create the window */
  mask = XCB_CW_BACK_PIXEL | XCB_CW_EVENT_MASK;
  values[0] = screen->black_pixel;
  values[1] = XCB_EVENT_MASK_EXPOSURE;
  xcb_create_window (c,                             /* Connection          */
                     XCB_COPY_FROM_PARENT,          /* depth               */
                     win,                           /* window Id           */
                     screen->root,                  /* parent window       */
                     0, 0,                          /* x, y                */
                     150, 150,                      /* width, height       */
                     10,                            /* border_width        */
                     XCB_WINDOW_CLASS_INPUT_OUTPUT, /* class               */
                     screen->root_visual,           /* visual              */
                     mask, values);                 /* masks */

  /* Map the window on the screen */
  xcb_map_window (c, win);

  /* We flush the request */
  xcb_flush (c);
  
  while ((e = xcb_wait_for_event (c))) {
    switch (e->response_type & ~0x80) {
    case XCB_EXPOSE: {
      /* We draw the points */
      //xcb_poly_point (c, XCB_COORD_MODE_ORIGIN, win, gcontext_red, 4, points);
      /* We flush the request */
      
      //draw lines
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineA);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineB);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineC);
      xcb_poly_line (c, XCB_COORD_MODE_ORIGIN, win, gcontext_white, 2, lineD);

      //draw rectangle
      xcb_poly_rectangle (c, win, gcontext_red, 1, rectangle);

      //draw arc
      xcb_poly_arc (c, win, gcontext_blue, 1, arc);

      //flush
      xcb_flush (c);

      break;
    }
    default: {
      /* Unknown event type, ignore it */
      break;
    }
    }
    /* Free the Generic Event */
    free (e);
  }

  return 0;
}



