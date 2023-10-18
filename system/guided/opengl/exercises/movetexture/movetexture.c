#include <gtk/gtk.h>
#include <epoxy/gl.h>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

static GLfloat vertices[] = {
   -1.0f, -1.0f, 0.0f, -1.0f, -1.0f,
    1.0f, -1.0f, 0.0f,  1.0f, -1.0f,
    0.0f,  1.0f, 0.0f,  0.0f,  1.0f,
};
unsigned int VBO, VAO;
static GLuint programID;
GtkWidget *gl_area;
unsigned int texture0,texture1;
GLuint VertexShaderID;
GLuint FragmentShaderID;
 
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

  // Generate buffers

  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);  
  glBindVertexArray(VAO);  
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
  glEnableVertexAttribArray(0);
  glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
  glEnableVertexAttribArray(1); 

  // Generate texture 0
  glGenTextures(1, &texture0);
  glBindTexture(GL_TEXTURE_2D, texture0);
  // set the texture wrapping/filtering options (on the currently bound texture object)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  // load and generate the texture
  int width0, height0, nrChannels0;
  unsigned char *data0 = stbi_load("texture.jpg", &width0, &height0, &nrChannels0, 0);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width0, height0, 0, GL_RGB, GL_UNSIGNED_BYTE, data0);
  glGenerateMipmap(GL_TEXTURE_2D);
  stbi_image_free(data0);

  // Generate texture 1
  glGenTextures(1, &texture1);
  glBindTexture(GL_TEXTURE_2D, texture1);
  // set the texture wrapping/filtering options (on the currently bound texture object)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);	
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  // load and generate the texture
  int width1, height1, nrChannels1;
  unsigned char *data1 = stbi_load("texture.png", &width1, &height1, &nrChannels1, 0);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width1, height1, 0, GL_RGBA, GL_UNSIGNED_BYTE, data1);
  glGenerateMipmap(GL_TEXTURE_2D);
  stbi_image_free(data1);

 
 
  // Source of shaders
  const char *vertex_shader_string = "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "layout (location = 1) in vec2 aTexCoord;\n"
    "out vec2 TexCoord;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "   TexCoord = aTexCoord;\n"
    "}\0";
  const char *fragment_shader_string = "#version 330 core\n"
    "in vec2 TexCoord;\n"
    "uniform sampler2D texture0;\n"
    "uniform sampler2D texture1;\n"
    "out vec4 FragColor;\n"
    "void main()\n"
    "{\n"
    "   FragColor = mix(texture(texture0, TexCoord), texture(texture1, vec2(TexCoord.x+0.5f,TexCoord.y+0.25f)),0.8);\n"
    "}\n\0";

   // Create the shaders
   VertexShaderID = glCreateShader(GL_VERTEX_SHADER);
   FragmentShaderID = glCreateShader(GL_FRAGMENT_SHADER);
  
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

   glUniform1i(glGetUniformLocation(programID, "texture0"), 0);
   glUniform1i(glGetUniformLocation(programID, "texture1"), 1);   

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

  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, texture0);
  glActiveTexture(GL_TEXTURE0+1);
  glBindTexture(GL_TEXTURE_2D, texture1);
  glUseProgram(programID);
  glBindVertexArray(VAO);

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