#include <gtk/gtk.h>
#include <glib/gstdio.h>
#include <gio/gio.h>

int matrix [12][3];
int matrix_projection [12][2];

float ks = 2.0;
float kw = 2.0;
float kh = 2.0;

static void
draw_function (GtkDrawingArea *area,
               cairo_t        *cr,
               int             width,
               int             height,
               gpointer        data);               
static void
button_sphere_control (GtkWidget *widget,
             gpointer   data);
static void
button_cube_control (GtkWidget *widget,
             gpointer   data);
static void
scale_size_control (GtkWidget *widget,
             gpointer   data);
static void
scale_horizontal_control (GtkWidget *widget,
             gpointer   data);
static void
scale_vertical_control (GtkWidget *widget,
             gpointer   data);

static void
activate (GtkApplication *app,
          gpointer        user_data)
{ 
  // Fill matrixes with 0
  for(int i = 0; i < 12; i++) {
    for( int j = 0; j < 3; j++){
        matrix[i][j] = 0;
    }
  }
  for(int i = 0; i < 12; i++) {
    for( int j = 0; j < 2; j++){
        matrix_projection[i][j] = 0;
    }   
  }  

  // Construct a GtkBuilder instance and load our UI description
  GtkBuilder *builder = gtk_builder_new ();
  gtk_builder_add_from_file (builder, "ui.ui", NULL);

  // Get window from GtkBuilder
  GObject *window = gtk_builder_get_object (builder, "window");
  gtk_window_set_application (GTK_WINDOW (window), app);
  gtk_window_maximize(GTK_WINDOW(window)); 
  // Get buttons from GtkBuilder
  GObject *button_sphere = gtk_builder_get_object(builder, "button_sphere");
  GObject *button_cube   = gtk_builder_get_object(builder, "button_cube");
  // Get scales from GtkBuilder
  GObject *scale_size            = gtk_builder_get_object(builder, "scale_size");
  GObject *adjustment_size       = gtk_builder_get_object(builder, "adjustment_size"); 
  GObject *scale_horizontal      = gtk_builder_get_object(builder, "scale_horizontal");
  GObject *adjustment_horizontal = gtk_builder_get_object(builder, "adjustment_horizontal"); 
  GObject *scale_vertical        = gtk_builder_get_object(builder, "scale_vertical");
  GObject *adjustment_vertical   = gtk_builder_get_object(builder, "adjustment_vertical"); 
 
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
  g_signal_connect (button_sphere, "clicked", G_CALLBACK (button_sphere_control), drawing_area);
  g_signal_connect (button_cube  , "clicked", G_CALLBACK (button_cube_control)  , drawing_area);
  // Set control functions to scale
  g_object_set_data(G_OBJECT(drawing_area), "adjustment_size"      , adjustment_size);
  g_object_set_data(G_OBJECT(drawing_area), "adjustment_horizontal", adjustment_horizontal);
  g_object_set_data(G_OBJECT(drawing_area), "adjustment_vertical"  , adjustment_vertical);
  g_signal_connect (scale_size      , "value-changed", G_CALLBACK (scale_size_control)      , drawing_area);
  g_signal_connect (scale_horizontal, "value-changed", G_CALLBACK (scale_horizontal_control), drawing_area);
  g_signal_connect (scale_vertical  , "value-changed", G_CALLBACK (scale_vertical_control)  , drawing_area);
 
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
  
  /*
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
  */
}

static void
button_sphere_control (GtkWidget *widget,
             gpointer   data)
{
  gtk_widget_queue_draw(data);
  g_print ("button_sphere_control\n");
}
static void
button_cube_control (GtkWidget *widget,
             gpointer   data)
{
  gtk_widget_queue_draw(data);
  g_print ("button_cube_control\n");
}
static void
scale_size_control (GtkWidget *widget,
             gpointer   data)
{
  gtk_widget_queue_draw(data);
  g_print ("scale_size_control\n");
}
static void
scale_horizontal_control (GtkWidget *widget,
             gpointer   data)
{
  gtk_widget_queue_draw(data);
  g_print ("scale_horizontal_control\n");
}
static void
scale_vertical_control (GtkWidget *widget,
             gpointer   data)
{
  gtk_widget_queue_draw(data);
  g_print ("scale_vertical_control\n");
}