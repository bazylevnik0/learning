#include "raylib.h"

int main(void)
{
    //set
    InitWindow(800, 450, "cellar door");
    // Define the camera to look into our 3d world
    Camera camera = { 0 };
    camera.position = (Vector3){ 14.0f, -0.33f, 1.0f }; // Camera position
    camera.target = (Vector3){ 0.0f, -1.0f, 1.0f };      // Camera looking at point
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };          // Camera up vector (rotation towards target)
    camera.fovy = 25.0f;                                // Camera field-of-view Y
    camera.projection = CAMERA_PERSPECTIVE;             // Camera mode type
    // Loaf gltf models
    Model modelMap   = LoadModel("src/model/map/map.glb");
    Model modelEnemy = LoadModel("src/model/enemy/enemy.glb");
    Model modelBoss  = LoadModel("src/model/boss/boss.glb");
    // Set models positions
    Vector3 positionMap    = { 0.0f, 0.0f, 1.0f };
    Vector3 positionEnemy1A = { 11.0f, -0.75f, 1.25f };      
    Vector3 positionEnemy1B = { 11.0f, -0.75f, 0.75f };              
    Vector3 positionEnemy2A = { 8.0f, -0.75f, 1.25f };      
    Vector3 positionEnemy2B = { 8.0f, -0.75f, 0.75f };              
    Vector3 positionEnemy3A = { 5.0f, -0.75f, 1.25f };      
    Vector3 positionEnemy3B = { 5.0f, -0.75f, 0.75f };              
    Vector3 positionEnemy4A = { 2.0f, -0.75f, 1.25f };      
    Vector3 positionEnemy4B = { 2.0f, -0.75f, 0.75f }; 
    Vector3 positionBoss    = { 0.0f, 0.0f, 1.0f };             
    // Set free camera mode
    SetCameraMode(camera, CAMERA_FREE); 
    // Set our game to run at 60 frames-per-second
    SetTargetFPS(25);                   
    //---
    //prepare
    float t = 0.0;
    //-------
    while (!WindowShouldClose())
    {
        //update
        UpdateCamera(&camera);
        //------
        //change
        float temp = 14.0 - t;
        camera.position = (Vector3){ temp, -0.33f, 1.0f };
        t += 0.01;
        //------
        //draw
        BeginDrawing();
            ClearBackground(RAYWHITE);
            BeginMode3D(camera);
            rlDisableBackfaceCulling();
                DrawModel(modelMap, positionMap, 1.0f, WHITE);
            rlEnableBackfaceCulling();
            DrawModel(modelEnemy, positionEnemy1A, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy1B, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy2A, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy2B, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy3A, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy3B, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy4A, 0.4f, WHITE);
            DrawModel(modelEnemy, positionEnemy4B, 0.4f, WHITE);
            DrawModel(modelBoss, positionBoss, 0.6f, WHITE);
            EndMode3D();
        EndDrawing();
        //----
    }
    //end
    UnloadModel(modelMap);
    UnloadModel(modelEnemy);
    CloseWindow();
    //---
    return 0;
}