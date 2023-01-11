#include <xcb/xcb.h>
#include <stdlib.h>
#include <string.h>

int
main ()
{
  xcb_connection_t *c;
  xcb_screen_t     *screen;
  xcb_window_t      win;
  xcb_generic_event_t *e;
  uint32_t          mask = 0;
  uint32_t          values[2];

  /* Open the connection to the X server */
  c = xcb_connect (NULL, NULL);

  /* Get the first screen */
  screen = xcb_setup_roots_iterator (xcb_get_setup (c)).data;

  /* Ask for our window's Id */
  win = xcb_generate_id(c);
  /* Create the window */
  mask = XCB_CW_BACK_PIXEL | XCB_CW_EVENT_MASK;
  values[0] = screen->white_pixel;
  values[1] = XCB_EVENT_MASK_EXPOSURE;
  xcb_create_window (c,                             /* Connection          */
                     XCB_COPY_FROM_PARENT,          /* depth (same as root)*/
                     win,                           /* window Id           */
                     screen->root,                  /* parent window       */
                     0, 0,                          /* x, y                */
                     150, 150,                      /* width, height       */
                     10,                            /* border_width        */
                     XCB_WINDOW_CLASS_INPUT_OUTPUT, /* class               */
                     screen->root_visual,           /* visual              */
                     mask, values);                 /* masks               */

  /* Get/Create font and context for font */
  uint32_t            values_gc[3];
  xcb_font_t          font;
  xcb_gcontext_t      gc;

  font = xcb_generate_id (c);
  xcb_open_font(c, font, strlen ("7x14"),"7x14");

  gc = xcb_generate_id (c);
  mask = XCB_GC_FOREGROUND | XCB_GC_BACKGROUND | XCB_GC_FONT;
  values_gc[0] = screen->black_pixel;
  values_gc[1] = screen->white_pixel;
  values_gc[2] = font;
  xcb_create_gc (c, gc, win, mask, values_gc);      

  xcb_close_font (c, font);                               
  
  
  /* Map the window on the screen */
  xcb_map_window (c, win);

  /* Make sure commands are sent before we pause, so window is shown */
  xcb_flush (c);

  while ((e = xcb_wait_for_event (c))) {
    switch (e->response_type & ~0x80) {
    case XCB_EXPOSE: {
      char *text;
      text = "Hello, world!";
      xcb_image_text_8 (c, strlen(text), win, gc, 10, 10, text);
      xcb_flush (c);

      break;
    }
    /* Free the Generic Event */
    free (e);
    }
  }

  return 0;
}