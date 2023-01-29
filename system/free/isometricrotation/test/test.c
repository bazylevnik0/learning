#include <gtk/gtk.h>
#include <glib/gstdio.h>
#include <gio/gio.h>

static void
print_hello (GtkWidget *widget,
             gpointer   data)
{
  g_print ("Hello World\n");
}

static void
activate (GtkApplication *app,
          gpointer        user_data)
{
  
  // Construct a GtkBuilder instance and load our UI description
  GtkBuilder *builder = gtk_builder_new ();
  gtk_builder_add_from_file (builder, "builder.ui", NULL);

  // Get window from GtkBuilder
  GObject *window = gtk_builder_get_object (builder, "window");
  gtk_window_set_application (GTK_WINDOW (window), app);

  // Get GtkFrameDraw from GtkBuilder
  GObject *frameDraw    = gtk_builder_get_object (builder, "GtkFrameDraw");
  // Create drawing_area and add to frameDraw
  GtkWidget *drawing_area = gtk_drawing_area_new ();
  gtk_widget_set_size_request (drawing_area, 900, 900);
  gtk_frame_set_child(GTK_FRAME(frameDraw),drawing_area);
  
  gtk_widget_show (GTK_WIDGET (window));

  // We do not need the builder any more
  g_object_unref (builder);
}

int
main (int   argc,
      char *argv[])
{
#ifdef GTK_SRCDIR
  g_chdir (GTK_SRCDIR);
#endif
                                                                //G_APPLICATION_DEFAULT_FLAGS
  GtkApplication *app = gtk_application_new ("org.gtk.example", 0);
  g_signal_connect (app, "activate", G_CALLBACK (activate), NULL);

  int status = g_application_run (G_APPLICATION (app), argc, argv);
  g_object_unref (app);

  return status;
}
