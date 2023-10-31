#include "glm/glm.hpp"
#include "glm/gtc/matrix_transform.hpp"
#include "glm/gtc/type_ptr.hpp"

using namespace std;

const char *vertex_shader_string = "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "uniform mat4 transform;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = transform * vec4(aPos, 1.0f);\n"
    "}\0";
const char *fragment_shader_string = "#version 330 core\n"
    "out vec4 FragColor;\n"
    "void main()\n"
    "{\n"
    "   FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
    "}\n\0";

glm::mat4 mat_glm = glm::mat4(1.0f);  
GLfloat *mat_ptr = glm::value_ptr(mat_glm);

void mat_transform(){
    mat_glm = glm::rotate(mat_glm, glm::radians(5.0f), glm::vec3(1.0, 1.0, 1.0));
}
