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
  // Get buttons from GtkBuilder
  GObject *button1 = gtk_builder_get_object(builder, "button1");
  GObject *button2 = gtk_builder_get_object(builder, "button2");
  // Get range from GtkBuilder
  GObject *scale = gtk_builder_get_object(builder, "scale");
  GObject *adjustment = gtk_builder_get_object(builder, "adjustment"); 
 
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

   // Set control functions to buttons
  g_signal_connect (button1, "clicked", G_CALLBACK (drawing1), drawing_area);
  g_signal_connect (button2, "clicked", G_CALLBACK (drawing2), drawing_area);
   // Set control functions to scale
  g_object_set_data(G_OBJECT(drawing_area), "adjustment", adjustment); //attach data to drawing_area
  g_signal_connect (scale, "value-changed", G_CALLBACK (drawing3), drawing_area);
 
   
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

  cairo_move_to (cr, width-width/100*0,  height/100*0);
  cairo_line_to (cr, width-width/100*10, height/100*10);
  cairo_move_to (cr, width-width/100*20, height/100*20);
  cairo_line_to (cr, width-width/100*30, height/100*30);
  cairo_set_line_width (cr, width/100);
  cairo_stroke (cr);

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