#include <gtk/gtk.h>
#include <glib/gstdio.h>
#include <gio/gio.h>

float kx = 2.0;
float ky = 2.0;
float ks = 2.0;


static void
drawing1 (GtkWidget *widget,
             gpointer   data);
static void
drawing2 (GtkWidget *widget,
             gpointer   data);
static void
drawing3 (GtkWidget *widget,
             gpointer   data);

static void
draw_function (GtkDrawingArea *area,
               cairo_t        *cr,
               int             width,
               int             height,
               gpointer        data);

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
  gtk_window_maximize(GTK_WINDOW(window)); 
  
  // Get GtkFrameDraw from GtkBuilder
  GObject *frameDraw    = gtk_builder_get_object (builder, "GtkFrameDraw");
  // Create drawing_area and add to frameDraw
  GtkWidget *drawing_area = gtk_drawing_area_new ();
  gtk_frame_set_child(GTK_FRAME(frameDraw),drawing_area);
  // Set drawing function to drawing_area
  gtk_drawing_area_set_content_width (GTK_DRAWING_AREA (drawing_area), 100);
  gtk_drawing_area_set_content_height (GTK_DRAWING_AREA (drawing_area), 100);
  gtk_drawing_area_set_draw_func (GTK_DRAWING_AREA (drawing_area),
                                  draw_function,
                                  NULL, NULL);
  gtk_widget_set_hexpand (drawing_area,TRUE); 
  gtk_widget_set_vexpand (drawing_area,TRUE);  
  
  // Get buttons from GtkBuilder
  GObject *button1 = gtk_builder_get_object(builder, "button1");
  GObject *button2 = gtk_builder_get_object(builder, "button2");
  // Set function to events
  g_signal_connect (button1, "clicked", G_CALLBACK (drawing1), drawing_area);
  g_signal_connect (button2, "clicked", G_CALLBACK (drawing2), drawing_area);

  // Get range from GtkBuilder
  GObject *scale = gtk_builder_get_object(builder, "scale");
  GObject *adjustment = gtk_builder_get_object(builder, "adjustment");
  // Set function to events
  g_object_set_data(G_OBJECT(drawing_area), "adjustment", adjustment); //attach data to drawing_area
  g_signal_connect (scale, "value-changed", G_CALLBACK (drawing3), drawing_area);
  
  gtk_widget_show (GTK_WIDGET (window));

  // true method:
  // Get information about monitor and request resize of window
  /*
  GdkSurface* surface = gtk_native_get_surface (GTK_NATIVE(window));
  GdkDisplay* display = gdk_display_get_default ();
  GdkMonitor* monitor = gdk_display_get_monitor_at_surface (display,surface);
  int height = gdk_monitor_get_height_mm (monitor);
  int width  = gdk_monitor_get_width_mm (monitor);
  */
  //int *width;
  //int *height;
  //gtk_window_get_default_size (GTK_WINDOW(window),width,height);
  //g_print("%d %d",*width,*height);
  //gtk_widget_set_size_request (GTK_WIDGET(window),width,height);



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

static void
draw_function (GtkDrawingArea *area,
               cairo_t        *cr,
               int             width,
               int             height,
               gpointer        data)
{
  GdkRGBA color;
  GtkStyleContext *context;

  context = gtk_widget_get_style_context (GTK_WIDGET (area));

  cairo_arc (cr,
             width / 2.0 / kx, height / 2.0 / ky,
             MIN (width, height) / 2.0 / ks,
             0, 2 * G_PI);

  gtk_style_context_get_color (context,
                               &color);
  gdk_cairo_set_source_rgba (cr, &color);

  cairo_fill (cr);
}

static void
drawing1 (GtkWidget *widget,
             gpointer   data)
{
  kx = 4.0;
  ky = 4.0;
  gtk_widget_queue_draw(data);
  g_print ("drawing1\n");
}
static void
drawing2 (GtkWidget *widget,
             gpointer   data)
{
  kx = 8.0;
  ky = 8.0;
  gtk_widget_queue_draw(data);
  g_print ("drawing2\n");
}
static void
drawing3 (GtkWidget *widget,
             gpointer   data)
{
  GtkWidget *adjustment = g_object_get_data(G_OBJECT(data), "adjustment");
  gdouble t = gtk_adjustment_get_value(GTK_ADJUSTMENT(adjustment));
  ks += t/100;
  gtk_widget_queue_draw(data);
  g_print ("drawing3\n");
}