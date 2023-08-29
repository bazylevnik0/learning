#include <gtk/gtk.h>
#include <epoxy/gl.h>

static void
realize (GtkGLArea *area)
{
  // We need to make the context current if we want to
  // call GL API
  gtk_gl_area_make_current (area);

  // If there were errors during the initialization or
  // when trying to make the context current, this
  // function will return a GError for you to catch
  if (gtk_gl_area_get_error (area) != NULL)
    return;

  g_print("realize\n");
}

static void
unrealize (GtkWidget *widget)
{
  gtk_gl_area_make_current (GTK_GL_AREA (widget));

  if (gtk_gl_area_get_error (GTK_GL_AREA (widget)) != NULL)
    return;
  
  g_print("unrealize\n");
}

static gboolean
render (GtkGLArea *area, GdkGLContext *context)
{
  glClearColor (0.0f, 0.0f, 1.0f, 0.5f);
  glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  g_print("render\n");

  return TRUE;
}

static void
activate (GtkApplication* app,
          gpointer        user_data)
{
  GtkWidget *window;

  window = gtk_application_window_new (app);
  gtk_window_set_title (GTK_WINDOW (window), "Window");
  gtk_window_set_default_size (GTK_WINDOW (window), 600, 600);
  

  // create a GtkGLArea instance
  GtkWidget *gl_area = gtk_gl_area_new ();
  gtk_widget_set_size_request (gl_area, 600, 600);
  gtk_window_set_child (GTK_WINDOW(window), gl_area);
  // connect to the "render" and "realize" signals
  g_signal_connect (gl_area, "realize", G_CALLBACK (realize), NULL); 
  g_signal_connect (gl_area, "unrealize", G_CALLBACK (unrealize), NULL);
  g_signal_connect (gl_area, "render" , G_CALLBACK (render) , NULL);  
 
  gtk_widget_set_visible (window,true);
}


int
main (int    argc,
      char **argv)
{
  GtkApplication *app;
  int status;

  app = gtk_application_new ("org.gtk.example", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect (app, "activate", G_CALLBACK (activate), NULL);
  status = g_application_run (G_APPLICATION (app), argc, argv);
  g_object_unref (app);

  return status;
}
