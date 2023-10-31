#include <gtk/gtk.h>
#include <epoxy/gl.h>

GLfloat vertices[] = {
   -0.5f, -0.5f, 0.0f,
    0.5f, -0.5f, 0.0f,
    0.0f,  0.5f, 0.0f,
};
unsigned int VBO, VAO;
GLuint programID;
GtkWidget *gl_area;
#include "helper.cpp"

static void
button_press(GtkEventControllerKey *controller,
     guint                           keyval,
     guint                           keycode,
     GdkModifierType                 state,
     gpointer                        data);

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

  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);  
  glBindVertexArray(VAO);  
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
  glEnableVertexAttribArray(0);
 
  // Source of shaders
 
   // Create the shaders
   GLuint VertexShaderID = glCreateShader(GL_VERTEX_SHADER);
   GLuint FragmentShaderID = glCreateShader(GL_FRAGMENT_SHADER);

   // Compile shaders
   glShaderSource(VertexShaderID, 1, &vertex_shader_string , NULL);
   glCompileShader(VertexShaderID);
  
   glShaderSource(FragmentShaderID, 1, &fragment_shader_string , NULL);
   glCompileShader(FragmentShaderID);

   // Create program
   programID = glCreateProgram();
   glAttachShader(programID, VertexShaderID);
   glAttachShader(programID, FragmentShaderID);
   glLinkProgram(programID);

   glDeleteShader(VertexShaderID);
   glDeleteShader(FragmentShaderID);

   glUseProgram(programID);

   unsigned int transformLoc = glGetUniformLocation(programID, "transform");
   glUseProgram(programID);
   glUniformMatrix4fv(transformLoc, 1, GL_FALSE,  mat_ptr );

   g_print("realize\n");
}

static void
unrealize (GtkWidget *widget)
{
  gtk_gl_area_make_current (GTK_GL_AREA (widget));

  if (gtk_gl_area_get_error (GTK_GL_AREA (widget)) != NULL)
    return;
  
  glDeleteProgram(programID);
  
  g_print("unrealize\n");
}

static gboolean
render (GtkGLArea *area, GdkGLContext *context)
{
  glClearColor (0.0f, 1.0f, 0.0f, 0.5f);
  glClear (GL_COLOR_BUFFER_BIT );

  unsigned int transformLoc = glGetUniformLocation(programID, "transform");
  glUseProgram(programID);
  glUniformMatrix4fv(transformLoc, 1, GL_FALSE,  mat_ptr );

  glDrawArrays(GL_TRIANGLES, 0, 3);

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
  gl_area = gtk_gl_area_new ();
  gtk_widget_set_size_request (gl_area, 600, 600);
  gtk_window_set_child (GTK_WINDOW(window), gl_area);
  // connect to the "render" and "realize" signals
  g_signal_connect (gl_area, "realize", G_CALLBACK (realize), NULL); 
  g_signal_connect (gl_area, "unrealize", G_CALLBACK (unrealize), NULL);
  g_signal_connect (gl_area, "render" , G_CALLBACK (render) , NULL);
  GtkEventController *buttons_controller = gtk_event_controller_key_new();
  gtk_widget_add_controller( GTK_WIDGET(window) , buttons_controller );
  g_signal_connect( buttons_controller, "key-pressed", G_CALLBACK( button_press ), gl_area );
  
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

static void
button_press(GtkEventControllerKey *controller,
     guint                           keyval,
     guint                           keycode,
     GdkModifierType                 state,
     gpointer                        data)
{
  mat_transform();
  gtk_gl_area_queue_render (GTK_GL_AREA(data)); //rerender
}
