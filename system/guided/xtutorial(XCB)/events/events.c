#include <stdlib.h>
#include <xcb/xcb.h>

int
main ()
{
  xcb_connection_t *c;
  xcb_screen_t     *screen;
  xcb_window_t      win;
  uint32_t          mask = 0;
  uint32_t          values[2];
  xcb_generic_event_t *e;

  /* Open the connection to the X server */
  c = xcb_connect (NULL, NULL);

  /* Get the first screen */
  screen = xcb_setup_roots_iterator (xcb_get_setup (c)).data;

  /* Ask for our window's Id */
  win = xcb_generate_id(c);

  /* Create the window */
  mask = XCB_CW_BACK_PIXEL | XCB_CW_EVENT_MASK;
  values[0] = screen->black_pixel;
  values[1] = XCB_EVENT_MASK_KEY_PRESS | XCB_EVENT_MASK_KEY_RELEASE;
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

  /* Map the window on the screen */
  xcb_map_window (c, win);

  /* Make sure commands are sent before we pause, so window is shown */
  xcb_flush (c);

  while ((e = xcb_wait_for_event (c))) {
    switch (e->response_type & ~0x80) {
    case XCB_EXPOSE: {
      xcb_expose_event_t *ev = (xcb_expose_event_t *)e;

      printf ("Window %ld exposed. Region to be redrawn at location (%d,%d), with dimension (%d,%d)\n",
              ev->window, ev->x, ev->y, ev->width, ev->height);
      break;
    }
    case XCB_KEY_PRESS: {
      xcb_key_press_event_t *ev = (xcb_key_press_event_t *)e;
      
      printf ("%ld pressed in window %ld\n",
              ev->detail,ev->event);
      break;
    }
    /* Free the Generic Event */
    free (e);
    }
  }
  return 0;
}