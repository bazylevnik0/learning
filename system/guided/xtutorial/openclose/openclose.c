#include <xcb/xcb.h>

int
main ()
{
  xcb_connection_t *c;

  /* Open the connection to the X server. Use the DISPLAY environment variable as the default display name */
  c = xcb_connect (NULL, NULL);
  xcb_disconnect ( c );

  return 0;
}