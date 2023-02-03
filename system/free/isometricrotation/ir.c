#include <gtk/gtk.h>
#include <glib/gstdio.h>
#include <gio/gio.h>
#include <math.h>

int matrix [12][3];                   // [x,y,z]
int matrix_icos_phi = (int)((25+sqrt(5))/2);
int matrix_original[12][3];        
float matrix_angle_original[12][2];   // 0 - horizontal, 1 - vertical 
int matrix_projection [12][2];        // [x,z]
int f = 0;                            // form: 1 - icos; 2 - para; 

static void
draw_function (GtkDrawingArea *area,
               cairo_t        *cr,
               int             width,
               int             height,
               gpointer        data);               
static void
button_icos_control (GtkWidget *widget,
             gpointer   data);
static void
button_para_control (GtkWidget *widget,
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
  GObject *button_icos = gtk_builder_get_object(builder, "button_icos");
  GObject *button_para = gtk_builder_get_object(builder, "button_para");
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
  g_signal_connect (button_icos, "clicked", G_CALLBACK (button_icos_control), drawing_area);
  g_signal_connect (button_para, "clicked", G_CALLBACK (button_para_control), drawing_area);
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
  
  //make projection: from matrix to matrix_projection
  for(int i = 0; i < 12; i++)
  {
    matrix_projection[i][0] = matrix[i][0];
    matrix_projection[i][1] = matrix[i][2];
    //fix coordinates for projection
    matrix_projection[i][0] += 50;
    matrix_projection[i][1] += 50;
    //rotate to isometric level(front to down,back to up)
    if (matrix[i][1] > 0)
    {
      matrix_projection[i][1] -= 10;
    }
    if (matrix[i][1] < 0)
    {
      matrix_projection[i][1] += 10;
    }
  }
  //draw
  if (f == 1)  // icos form
  { 
    /*
    //1
    //3->8->0->3
    cairo_move_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[8][0],  height/100*matrix_projection[8][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]); 
    //3->9->0
    cairo_move_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[9][0],  height/100*matrix_projection[9][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    */
    //2
    //2->11->1->2
    cairo_move_to (cr, width-width/100*matrix_projection[2][0] ,  height/100*matrix_projection[2][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[11][0],  height/100*matrix_projection[11][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[1][0] ,  height/100*matrix_projection[1][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[2][0] ,  height/100*matrix_projection[2][1]);
    //2->10->1
    cairo_move_to (cr, width-width/100*matrix_projection[2][0] ,  height/100*matrix_projection[2][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[10][0],  height/100*matrix_projection[10][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[1][0] ,  height/100*matrix_projection[1][1]);
    /*
    //3
    //0->4->7->0
    cairo_move_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[4][0],  height/100*matrix_projection[4][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[7][0],  height/100*matrix_projection[7][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    //4->1->7
    cairo_move_to (cr, width-width/100*matrix_projection[4][0],  height/100*matrix_projection[4][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[1][0],  height/100*matrix_projection[1][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[7][0],  height/100*matrix_projection[7][1]);
    //4
    //3->5->6->3
    cairo_move_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[5][0],  height/100*matrix_projection[5][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[6][0],  height/100*matrix_projection[6][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
    //5->2->6
    cairo_move_to (cr, width-width/100*matrix_projection[5][0],  height/100*matrix_projection[5][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[2][0],  height/100*matrix_projection[2][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[6][0],  height/100*matrix_projection[6][1]);
    */
    /*
    //5
    //8->4->11->8
    cairo_move_to (cr, width-width/100*matrix_projection[8][0] ,  height/100*matrix_projection[8][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[4][0] ,  height/100*matrix_projection[4][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[11][0],  height/100*matrix_projection[11][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[8][0] ,  height/100*matrix_projection[8][1]);
    //8->5->11
    cairo_move_to (cr, width-width/100*matrix_projection[8][0] ,  height/100*matrix_projection[8][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[5][0] ,  height/100*matrix_projection[5][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[11][0],  height/100*matrix_projection[11][1]);
    //6
    //9->7->10->9
    cairo_move_to (cr, width-width/100*matrix_projection[9][0] ,  height/100*matrix_projection[9][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[7][0] ,  height/100*matrix_projection[7][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[10][0],  height/100*matrix_projection[10][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[9][0] ,  height/100*matrix_projection[9][1]);
    //9->6->10
    cairo_move_to (cr, width-width/100*matrix_projection[9][0] ,  height/100*matrix_projection[9][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[6][0] ,  height/100*matrix_projection[6][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[10][0],  height/100*matrix_projection[10][1]); 
    */
  }
  if (f == 2)  // para form
  {
    //0->1->2->3->0;
    cairo_move_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[1][0],  height/100*matrix_projection[1][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[2][0],  height/100*matrix_projection[2][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    //4->5->6->7->4;
    cairo_move_to (cr, width-width/100*matrix_projection[4][0],  height/100*matrix_projection[4][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[5][0],  height/100*matrix_projection[5][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[6][0],  height/100*matrix_projection[6][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[7][0],  height/100*matrix_projection[7][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[4][0],  height/100*matrix_projection[4][1]);
    //4->0;5->1;6->2;7->3;
    cairo_move_to (cr, width-width/100*matrix_projection[4][0],  height/100*matrix_projection[4][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[0][0],  height/100*matrix_projection[0][1]);
    cairo_move_to (cr, width-width/100*matrix_projection[5][0],  height/100*matrix_projection[5][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[1][0],  height/100*matrix_projection[1][1]);
    cairo_move_to (cr, width-width/100*matrix_projection[6][0],  height/100*matrix_projection[6][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[2][0],  height/100*matrix_projection[2][1]);
    cairo_move_to (cr, width-width/100*matrix_projection[7][0],  height/100*matrix_projection[7][1]);
    cairo_line_to (cr, width-width/100*matrix_projection[3][0],  height/100*matrix_projection[3][1]);
  }
  cairo_set_line_width (cr, width/100);
  cairo_stroke (cr);

  gtk_style_context_get_color (context,
                               &color);
  gdk_cairo_set_source_rgba (cr, &color);

  cairo_fill (cr);  
}

static void
button_icos_control (GtkWidget *widget,
             gpointer   data)
{
  f = 1; // change form for draw_function
  //rebuild default matrix:
  //0
  matrix[0][0] =  matrix_icos_phi;
  matrix[0][1] =  25;
  matrix[0][2] =  0;
  //1
  matrix[1][0] =  matrix_icos_phi;
  matrix[1][1] = -25;
  matrix[1][2] =  0;
  //2
  matrix[2][0] = -matrix_icos_phi;
  matrix[2][1] = -25;
  matrix[2][2] =  0;
  //3
  matrix[3][0] = -matrix_icos_phi;
  matrix[3][1] =  25;
  matrix[3][2] =  0;
  //4
  matrix[4][0] =  25;
  matrix[4][1] =  0;
  matrix[4][2] =  matrix_icos_phi;
  //5
  matrix[5][0] = -25;
  matrix[5][1] =  0;
  matrix[5][2] =  matrix_icos_phi;
  //6
  matrix[6][0] = -25;
  matrix[6][1] =  0;
  matrix[6][2] = -matrix_icos_phi;
  //7
  matrix[7][0] =  25;
  matrix[7][1] =  0;
  matrix[7][2] = -matrix_icos_phi;
  //8
  matrix[8][0] =  0;
  matrix[8][1] =  matrix_icos_phi;
  matrix[8][2] =  25;
  //9
  matrix[9][0] =  0;
  matrix[9][1] =  matrix_icos_phi;
  matrix[9][2] = -25;
  //10
  matrix[10][0] =  0;
  matrix[10][1] = -matrix_icos_phi;
  matrix[10][2] = -25;
  //11
  matrix[11][0] =  0;
  matrix[11][1] = -matrix_icos_phi;
  matrix[11][2] =  25;
  //fill matrix_original
  for(int i = 0; i < 12; i++)
  {
    for(int j = 0; j < 3; j++)
    {
      matrix_original[i][j] = matrix[i][j];
    }
  }
  //fill matrix_angle_original
  float x0 = 0.0;
  float y0 = 0.0;
  float z0 = 0.0;
  for (int i = 0; i < 12; i++)
  {
    //find original angle
    //horizontal
    float angle_horizontal;
    x0 = (float)matrix[i][0];
    y0 = (float)matrix[i][1];
    angle_horizontal = atanf(fabsf(y0)/fabsf(x0)); 
    //to principal angle
    if(x0 > 0 && y0 > 0)
    {
      angle_horizontal = angle_horizontal;
    }
    if(x0 < 0 && y0 > 0)
    {
      angle_horizontal = M_PI - angle_horizontal;
    }
    if(x0 < 0 && y0 < 0)
    {
      angle_horizontal = M_PI + angle_horizontal;
    }
    if(x0 > 0 && y0 < 0)
    {
      angle_horizontal = M_PI*2 - angle_horizontal;
    }
    //fix angles between parts
    if(x0 ==0)
    {
      if(y0 > 0)
      {
        angle_horizontal = angle_horizontal;
      }
      if(y0 < 0)
      {
        angle_horizontal = (-1)*angle_horizontal;
      }
    }
    if(y0 ==0)
    {
      if(x0 > 0)
      {
        angle_horizontal = angle_horizontal;
      }
      if(x0 < 0)
      {
        angle_horizontal = M_PI;
      }
    }
    matrix_angle_original[i][0] = angle_horizontal;
    //vertical
    float angle_vertical;
    z0 = (float)matrix[i][2];
    y0 = (float)matrix[i][1];
    angle_vertical = atanf(fabsf(z0)/fabsf(y0)); 
    //%
    if(i == 2 || i == 1)
    {
      g_print("%s\n","find_original_angle");
      g_print("z0:%f y0:%f ",z0,y0);
      g_print("%f ",angle_vertical);
    }
    //to principal angle
    if(y0 > 0 && z0 > 0)
    {
      angle_vertical = angle_vertical;
    }
    if(y0 < 0 && z0 > 0)
    {
      angle_vertical = M_PI - angle_vertical;
    }
    if(y0 < 0 && z0 < 0)
    {
      angle_vertical = M_PI + angle_vertical;
    }
    if(y0 > 0 && z0 < 0)
    {
      angle_vertical = M_PI*2 - angle_vertical;
    }
    //$
    //fix angles between parts
    if(z0 ==0)
    {
      if(y0 > 0)
      {
        angle_horizontal = angle_horizontal;
      }
      if(y0 < 0)
      {
        angle_horizontal = (-1)*angle_horizontal;
      }
    }
    /*
    if(y0 ==0)
    {
      if(x0 > 0)
      {
        angle_horizontal = angle_horizontal;
      }
      if(x0 < 0)
      {
        angle_horizontal = M_PI;
      }
    }
    */
    //%
    if(i == 2 || i == 1)
    {
      g_print("%f\n",angle_vertical);
    } 
    matrix_angle_original[i][1] = angle_vertical;
  }
  gtk_widget_queue_draw(data);
}
static void
button_para_control (GtkWidget *widget,
             gpointer   data)
{
  f = 2; // change form for draw_function
  //rebuild matrix:
  //0
  matrix[0][0] = -25;
  matrix[0][1] =  25;
  matrix[0][2] =  25;
  //1
  matrix[1][0] = -25;
  matrix[1][1] = -25;
  matrix[1][2] =  25;
  //2
  matrix[2][0] =  25;
  matrix[2][1] = -25;
  matrix[2][2] =  25;
  //3
  matrix[3][0] =  25;
  matrix[3][1] =  25;
  matrix[3][2] =  25;
  //4
  matrix[4][0] = -25;
  matrix[4][1] =  25;
  matrix[4][2] = -25;
  //5
  matrix[5][0] = -25;
  matrix[5][1] = -25;
  matrix[5][2] = -25;
  //6
  matrix[6][0] =  25;
  matrix[6][1] = -25;
  matrix[6][2] = -25;
  //7
  matrix[7][0] =  25;
  matrix[7][1] =  25;
  matrix[7][2] = -25;
  //fill matrix_original
  for(int i = 0; i < 12; i++)
  {
    for(int j = 0; j < 3; j++)
    {
      matrix_original[i][j] = matrix[i][j];
    }
  }
  //fill matrix_angle_original
  float x0 = 0.0;
  float y0 = 0.0;
  float z0 = 0.0;
  for (int i = 0; i < 12; i++)
  {
    //find original angle
    //horizontal
    float angle_horizontal;
    x0 = (float)matrix[i][0];
    y0 = (float)matrix[i][1];
    angle_horizontal = atanf(fabsf(y0)/fabsf(x0)); 
    //to principal angle
    if(x0 > 0 && y0 > 0)
    {
      angle_horizontal = angle_horizontal;
    }
    if(x0 < 0 && y0 > 0)
    {
      angle_horizontal = M_PI - angle_horizontal;
    }
    if(x0 < 0 && y0 < 0)
    {
      angle_horizontal = M_PI + angle_horizontal;
    }
    if(x0 > 0 && y0 < 0)
    {
      angle_horizontal = M_PI*2 - angle_horizontal;
    }
    matrix_angle_original[i][0] = angle_horizontal;
    //vertical
    float angle_vertical;
    z0 = (float)matrix[i][2];
    y0 = (float)matrix[i][1];
    angle_vertical = atanf(fabsf(z0)/fabsf(y0)); 
    //to principal angle
    if(y0 > 0 && z0 > 0)
    {
      angle_vertical = angle_vertical;
    }
    if(y0 < 0 && z0 > 0)
    {
      angle_vertical = M_PI - angle_vertical;
    }
    if(y0 < 0 && z0 < 0)
    {
      angle_vertical = M_PI + angle_vertical;
    }
    if(y0 > 0 && z0 < 0)
    {
      angle_vertical = M_PI*2 - angle_vertical;
    }
    matrix_angle_original[i][1] = angle_vertical;
  }  
  //redraw
  gtk_widget_queue_draw(data);
}
static void
scale_size_control (GtkWidget *widget,
             gpointer   data)
{
  //get scale changes
  GtkWidget *adjustment = g_object_get_data(G_OBJECT(data), "adjustment_size");
  gdouble t = gtk_adjustment_get_value(GTK_ADJUSTMENT(adjustment));
  //recalculate matrix
  for(int i = 0; i < 12; i++)
  {
    for(int j = 0; j < 3; j++)
    {
      matrix[i][j] = (int)((float)matrix_original[i][j]*t);
    }
  }
  //redraw
  gtk_widget_queue_draw(data);
}
static void
scale_horizontal_control (GtkWidget *widget,
             gpointer   data)
{
  g_print("%s","scale_horizontal_control\n");
  //get scale changes
  GtkWidget *adjustment = g_object_get_data(G_OBJECT(data), "adjustment_horizontal");
  gdouble t = gtk_adjustment_get_value(GTK_ADJUSTMENT(adjustment));
  //recalculate matrix
  float r;
  float x = 0.0;
  float y = 0.0;
  for (int i = 0; i < 12; i++)
  {
    float angle;
    angle = matrix_angle_original[i][0] + M_PI*t/180;
    
    r = sqrtf(matrix_original[i][0]*matrix_original[i][0]+matrix_original[i][1]*matrix_original[i][1]);
   
    x = r*cos(angle);
    y = r*sin(angle);
    matrix[i][0] = (int)x;
    matrix[i][1] = (int)y;
  }
  //redraw
  gtk_widget_queue_draw(data);
}
static void
scale_vertical_control (GtkWidget *widget,
             gpointer   data)
{
  //get scale changes
  GtkWidget *adjustment = g_object_get_data(G_OBJECT(data), "adjustment_vertical");
  gdouble t = gtk_adjustment_get_value(GTK_ADJUSTMENT(adjustment));
  //recalculate matrix
  float r;
  float z = 0.0;
  float y = 0.0;
  for (int i = 0; i < 12; i++)
  {
    float angle;
    //%
    if (i == 2 || i == 1)
    {
      g_print("mag:%f ",matrix_angle_original[i][1]);
    }
    angle = matrix_angle_original[i][1] + M_PI*t/180;
    if (i == 2 || i == 1)
    {
      g_print("angle:%f ",angle);
    }
    r = sqrtf(matrix_original[i][2]*matrix_original[i][2]+matrix_original[i][1]*matrix_original[i][1]);
    if (i == 2 || i == 1)
    {
      g_print("r:%f ", r);
    }
    y = r*cos(angle);
    z = r*sin(angle);
    if (i == 2 || i == 1)
    {
      g_print("z:%d,y:%d\n", (int)z, (int)y);
    }
    matrix[i][2] = (int)z;
    matrix[i][1] = (int)y;
  }
  //redraw
  gtk_widget_queue_draw(data);
}