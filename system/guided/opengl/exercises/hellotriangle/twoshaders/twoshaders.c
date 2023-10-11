#include <gtk/gtk.h>
#include <epoxy/gl.h>

static GLfloat verticesA[] = {
   -1.0f, -1.0f, 0.0f,
    0.0f, -1.0f, 0.0f,
    0.0f,  0.0f, 0.0f,
};
static GLfloat verticesB[] = {
    0.0f,  0.0f, 1.0f,
    1.0f,  0.0f, 1.0f,
    1.0f,  1.0f, 1.0f,
};
unsigned int VBO[2], VAO[2];
static GLuint programIDa, programIDb;
GtkWidget *gl_area;

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

  glGenVertexArrays(2, VAO);
  glGenBuffers(2, VBO);

  glBindVertexArray(VAO[0]);  
  glBindBuffer(GL_ARRAY_BUFFER, VBO[0]);
  glBufferData(GL_ARRAY_BUFFER, sizeof(verticesA), verticesA, GL_STATIC_DRAW); 
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
  glEnableVertexAttribArray(0);

  glBindVertexArray(VAO[1]);  
  glBindBuffer(GL_ARRAY_BUFFER, VBO[1]);
  glBufferData(GL_ARRAY_BUFFER, sizeof(verticesB), verticesB, GL_STATIC_DRAW); 
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
  glEnableVertexAttribArray(0);

  // Source of shaders
  const char *vertex_shader_string = "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";
  const char *fragment_shader_stringA = "#version 330 core\n"
    "out vec4 FragColor;\n"
      "void main()\n"
    "{\n"
    "   FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
    "}\n\0";
  const char *fragment_shader_stringB = "#version 330 core\n"
    "out vec4 FragColor;\n"
      "void main()\n"
    "{\n"
    "   FragColor = vec4(0.2f, 0.5f, 1.0f, 1.0f);\n"
    "}\n\0";

   // Create the shaders
   GLuint VertexShaderID = glCreateShader(GL_VERTEX_SHADER);
   GLuint FragmentShaderIDa = glCreateShader(GL_FRAGMENT_SHADER);
   GLuint FragmentShaderIDb = glCreateShader(GL_FRAGMENT_SHADER);

   // Compile shaders
   glShaderSource(VertexShaderID, 1, &vertex_shader_string , NULL);
   glCompileShader(VertexShaderID);
  
   glShaderSource(FragmentShaderIDa, 1, &fragment_shader_stringA , NULL);
   glShaderSource(FragmentShaderIDb, 1, &fragment_shader_stringB , NULL);
   glCompileShader(FragmentShaderIDa);
   glCompileShader(FragmentShaderIDb);

   // Create programs
   programIDa = glCreateProgram();
   glAttachShader(programIDa, VertexShaderID);
   glAttachShader(programIDa, FragmentShaderIDa);
   glLinkProgram(programIDa);
   programIDb = glCreateProgram();
   glAttachShader(programIDb, VertexShaderID);
   glAttachShader(programIDb, FragmentShaderIDb);
   glLinkProgram(programIDb);
 
   glDeleteShader(VertexShaderID);
   glDeleteShader(FragmentShaderIDa);
   glDeleteShader(FragmentShaderIDb);

   g_print("realize\n");
}

static void
unrealize (GtkWidget *widget)
{
  gtk_gl_area_make_current (GTK_GL_AREA (widget));

  if (gtk_gl_area_get_error (GTK_GL_AREA (widget)) != NULL)
    return;
  
  glDeleteProgram(programIDa);
  glDeleteProgram(programIDb);
  
  g_print("unrealize\n");
}

static gboolean
render (GtkGLArea *area, GdkGLContext *context)
{
  glClearColor (0.0f, 1.0f, 0.0f, 0.5f);
  glClear (GL_COLOR_BUFFER_BIT );

  glUseProgram(programIDa);
  glBindVertexArray(VAO[0]);
  glDrawArrays(GL_TRIANGLES, 0, 3);
  glUseProgram(programIDb);
  glBindVertexArray(VAO[1]);
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