#include <iostream>
#include "glm/glm.hpp"
#include "glm/gtc/matrix_transform.hpp"
#include "glm/gtc/type_ptr.hpp"
#include "helper.h"


using namespace std;

void transform_vec(float *tempX, float *tempY, float *tempZ){
    glm::vec4 vec(*tempX, *tempY, *tempZ, 1.0f);
    glm::mat4 trans = glm::mat4(1.0f);
    trans = glm::translate(trans, glm::vec3(0.1f, 0.1f, 0.1f));
    vec = trans * vec;
    //reassign
    *tempX = vec.x; 
    *tempY = vec.y;
    *tempZ = vec.z;
}
