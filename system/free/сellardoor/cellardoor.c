#include "raylib.h"

int main(void)
{
    //set  
    InitWindow(800, 450, "cellar door");
    int display = GetCurrentMonitor();
    SetWindowSize(GetMonitorWidth(display), GetMonitorHeight(display));
    SetWindowPosition(0,0);
    // Initialize audio device
    InitAudioDevice();      
    // Define the camera to look into our 3d world
    Camera camera = { 0 };
    camera.position = (Vector3){ 15.0f, -0.33f, 1.0f }; // Camera position
    camera.target   = (Vector3){  0.0f, -1.0f , 1.0f }; // Camera looking at point
    camera.up       = (Vector3){  0.0f,  1.0f , 0.0f }; // Camera up vector (rotation towards target)
    camera.fovy = 25.0f;                                // Camera field-of-view Y
    camera.projection = CAMERA_PERSPECTIVE;             // Camera mode type
    // Set free camera mode
    SetCameraMode(camera, CAMERA_FREE); 
    // Set our game to run at 60 frames-per-second
    SetTargetFPS(25);                   
    // Loaf gltf models
    Model modelMap   = LoadModel("src/model/map/map.glb");
    Model modelEnemy = LoadModel("src/model/enemy/enemy.glb");
    Model modelBoss  = LoadModel("src/model/boss/boss.glb");
    // Set models positions
    Vector3 positionMap     = {  0.0f,  0.0f,  1.0f  };
    Vector3 positionEnemy1A = { 11.0f, -1.75f, 1.25f };      
    Vector3 positionEnemy1B = { 11.0f, -1.75f, 0.75f };              
    Vector3 positionEnemy2A = {  8.0f, -1.75f, 1.25f };      
    Vector3 positionEnemy2B = {  8.0f, -1.75f, 0.75f };              
    Vector3 positionEnemy3A = {  5.0f, -1.75f, 1.25f };      
    Vector3 positionEnemy3B = {  5.0f, -1.75f, 0.75f };              
    Vector3 positionEnemy4A = {  2.0f, -1.75f, 1.25f };      
    Vector3 positionEnemy4B = {  2.0f, -1.75f, 0.75f }; 
    Vector3 positionBoss    = {  0.0f, -9.99f , 1.1f  };
    // Load splash texture
    Texture2D splash_texture = LoadTexture("src/image/splash.png");        
    Texture2D gun0_texture = LoadTexture("src/image/gun0.png");        
    Texture2D gun1_texture = LoadTexture("src/image/gun1.png");        
    // Load sound
    Sound sound_music_level   = LoadSound("src/sound/music_level.wav"); 
    Sound sound_music_boss    = LoadSound("src/sound/music_boss.wav"); 
    Sound sound_bah           = LoadSound("src/sound/bah.wav");
    Sound sound_boss_death    = LoadSound("src/sound/boss_death.wav");
    Sound sound_krik1 = LoadSound("src/sound/krik1.wav");
    Sound sound_krik2 = LoadSound("src/sound/krik2.wav");
    Sound sound_krik3 = LoadSound("src/sound/krik3.wav");
    Sound sound_krik4 = LoadSound("src/sound/krik4.wav");
    // Set sound volume
    SetSoundVolume(sound_music_level, 0.25f);  
    SetSoundVolume(sound_music_boss , 0.25f);  
    SetSoundVolume(sound_bah , 0.5f);  
    SetSoundVolume(sound_krik1 , 1.0f);  
    SetSoundVolume(sound_krik2 , 1.0f);  
    SetSoundVolume(sound_krik3 , 1.0f);  
    SetSoundVolume(sound_krik4 , 1.0f);  
    //---
    //prepare
    float t   = 0.0;
    int i = 0;
    int step1 = 0;
    int step2 = 0;
    int step3 = 0;
    int step4 = 0;
    int step5 = 0;
    int game  = 0;
    int move  = 1;
    int hitA  = 0;
    int hitB  = 0;
    int hitC  = 0;
    int score = 0;
    float gun1_texture_position_y = GetScreenHeight();
    gun1_texture_position_y = GetScreenHeight() - 350.0;
    //-------
    Ray ray = { 0 };                    // Picking line ray
    RayCollision collisionA = { 0 };
    RayCollision collisionB = { 0 };
    RayCollision collisionC = { 0 };
    Vector2 position_cursor = { 0.0f, 0.0f };   
    //play sound theme
    PlaySound(sound_music_level);
    while (!WindowShouldClose())
    {
       //update
        UpdateCamera(&camera);
        //------
        //change
        if ( i < 25 ) {
            gun1_texture_position_y = GetScreenHeight();
            i++;
        } else {
            i = 0;
        }
        //step1
        if(t > 1.0f && t < 1.02f)
        {
            if (step1 == 0) PlaySound(sound_krik1);
            move = 0;
            step1 = 1;
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            if(hitA == 0){positionEnemy1A.y = -0.5f;}
            if(hitB == 0){positionEnemy1B.y = -0.5f;}
        }
        if(step1 == 1)
        {
            Vector3 targetSize = { 0.4f, 0.4f, 0.4f };
            if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
            {
               PlaySound(sound_bah);
               gun1_texture_position_y = GetScreenHeight() - 350.0; 
               //splash texture
               //collision engine
               ray = GetMouseRay(GetMousePosition(), camera);
               // Check collision between ray and box
               collisionA = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy1A.x - targetSize.x/2, positionEnemy1A.y - targetSize.y/2, positionEnemy1A.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy1A.x + targetSize.x/2, positionEnemy1A.y + targetSize.y/2, positionEnemy1A.z + targetSize.z/2 }});
               if (collisionA.hit)
               {
                    hitA = 1;
                    positionEnemy1A.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
               collisionB = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy1B.x - targetSize.x/2, positionEnemy1B.y - targetSize.y/2, positionEnemy1B.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy1B.x + targetSize.x/2, positionEnemy1B.y + targetSize.y/2, positionEnemy1B.z + targetSize.z/2 }});
               if (collisionB.hit)
               {
                    hitB = 1;
                    positionEnemy1B.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
            }
            if(hitA == 1 && hitB == 1)
            {
                step1 = 2;
                hitA = 0;
                hitB = 0;
            }
            if(step1 == 2)
            {
                t += 0.2;
                move = 1;
            }
        }
        //step2
        if(t > 4.0f && t < 4.02f)
        {
            if (step2 == 0) PlaySound(sound_krik2);
            move = 0;
            step2 = 1;
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            if(hitA == 0){positionEnemy2A.y = -0.5f;}
            if(hitB == 0){positionEnemy2B.y = -0.5f;}
        }
        if(step2 == 1)
        {
            Vector3 targetSize = { 0.4f, 0.4f, 0.4f };
            if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
            {
               PlaySound(sound_bah);
               gun1_texture_position_y = GetScreenHeight() - 350.0;  
               ray = GetMouseRay(GetMousePosition(), camera);
               // Check collision between ray and box
               collisionA = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy2A.x - targetSize.x/2, positionEnemy2A.y - targetSize.y/2, positionEnemy2A.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy2A.x + targetSize.x/2, positionEnemy2A.y + targetSize.y/2, positionEnemy2A.z + targetSize.z/2 }});
               if (collisionA.hit)
               {
                    hitA = 1;
                    positionEnemy2A.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
               collisionB = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy2B.x - targetSize.x/2, positionEnemy2B.y - targetSize.y/2, positionEnemy2B.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy2B.x + targetSize.x/2, positionEnemy2B.y + targetSize.y/2, positionEnemy2B.z + targetSize.z/2 }});
               if (collisionB.hit)
               {
                    hitB = 1;
                    positionEnemy2B.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
            }
            if(hitA == 1 && hitB == 1)
            {
                step2 = 2;
                hitA = 0;
                hitB = 0;
            }
            if(step2 == 2)
            {
                t += 0.2;
             
                move = 1;
            }
        }
        //step3
        if(t > 7.0f && t < 7.02f)
        {
            if (step3 == 0) PlaySound(sound_krik3);
            move = 0;
            step3 = 1;
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            if(hitA == 0){positionEnemy3A.y = -0.5f;}
            if(hitB == 0){positionEnemy3B.y = -0.5f;}
        }
        if(step3 == 1)
        {
            Vector3 targetSize = { 0.4f, 0.4f, 0.4f };
            if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
            {
               PlaySound(sound_bah);
               gun1_texture_position_y = GetScreenHeight() - 350.0; 
               ray = GetMouseRay(GetMousePosition(), camera);
               // Check collision between ray and box
               collisionA = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy3A.x - targetSize.x/2, positionEnemy3A.y - targetSize.y/2, positionEnemy3A.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy3A.x + targetSize.x/2, positionEnemy3A.y + targetSize.y/2, positionEnemy3A.z + targetSize.z/2 }});
               if (collisionA.hit)
               {
                    hitA = 1;
                    positionEnemy3A.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
               collisionB = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy3B.x - targetSize.x/2, positionEnemy3B.y - targetSize.y/2, positionEnemy3B.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy3B.x + targetSize.x/2, positionEnemy3B.y + targetSize.y/2, positionEnemy3B.z + targetSize.z/2 }});
               if (collisionB.hit)
               {
                    hitB = 1;
                    positionEnemy3B.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
            }
            if(hitA == 1 && hitB == 1)
            {
                step3 = 2;
                hitA = 0;
                hitB = 0;
            }
            if(step3 == 2)
            {
                t += 0.2;
                move = 1;
            }
        }
        //step4
        if(t > 10.0f && t < 10.02f)
        {
            if (step4 == 0) PlaySound(sound_krik4);
            move = 0;
            step4 = 1;
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            if(hitA == 0){positionEnemy4A.y = -0.5f;}
            if(hitB == 0){positionEnemy4B.y = -0.5f;}
        }
        if(step4 == 1)
        {
            Vector3 targetSize = { 0.4f, 0.4f, 0.4f };
            if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
            {
               PlaySound(sound_bah);
               gun1_texture_position_y = GetScreenHeight() - 350.0; 
               ray = GetMouseRay(GetMousePosition(), camera);
               // Check collision between ray and box
               collisionA = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy4A.x - targetSize.x/2, positionEnemy4A.y - targetSize.y/2, positionEnemy4A.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy4A.x + targetSize.x/2, positionEnemy4A.y + targetSize.y/2, positionEnemy4A.z + targetSize.z/2 }});
               if (collisionA.hit)
               {
                    hitA = 1;
                    positionEnemy4A.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
               collisionB = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionEnemy4B.x - targetSize.x/2, positionEnemy4B.y - targetSize.y/2, positionEnemy4B.z - targetSize.z/2 },
                                          (Vector3){ positionEnemy4B.x + targetSize.x/2, positionEnemy4B.y + targetSize.y/2, positionEnemy4B.z + targetSize.z/2 }});
               if (collisionB.hit)
               {
                    hitB = 1;
                    positionEnemy4B.y = -1.75f;

                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
            }
            if(hitA == 1 && hitB == 1)
            {
                step4 = 2;
                hitA = 0;
                hitB = 0;
            }
            if(step4 == 2)
            {
                t += 0.2;
                move = 1;
            }
        }
        //step5
        if(t > 13.0f && t < 13.02f)
        {
            if (step5 == 0) 
            {
                StopSound(sound_music_level);
                PlaySound(sound_krik1);
                PlaySound(sound_krik2);
                PlaySound(sound_krik3);
                PlaySound(sound_krik4);
                PlaySound(sound_music_boss);
            }
            move = 0;
            step5 = 1;
            float temp = 14.0 - t;
            if (score <= 29) { positionBoss.y = 0.0f; }      
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            camera.target   = (Vector3){ 0.0f, 0.00f , 1.0f };
            camera.fovy = 75.0f;
        }
        if(step5 == 1)
        {
            Vector3 targetSize = { 1.0f, 1.0f, 1.0f };
            if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
            {
               PlaySound(sound_bah);
               gun1_texture_position_y = GetScreenHeight() - 350.0; 
               ray = GetMouseRay(GetMousePosition(), camera);
               // Check collision between ray and box
               collisionC = GetRayCollisionBox(ray,
                            (BoundingBox){(Vector3){ positionBoss.x - targetSize.x/2, positionBoss.y - targetSize.y/2, positionBoss.z - targetSize.z/2 },
                                          (Vector3){ positionBoss.x + targetSize.x/2, positionBoss.y + targetSize.y/2, positionBoss.z + targetSize.z/2 }});
               if (collisionC.hit)
               {
                    score += 1;
                    if (score > 99) 
                    {
                        positionBoss.y = -9.99f;
                    }
                    //splash texture
                    position_cursor = GetMousePosition();
                    position_cursor.x -= 150.0f;
                    position_cursor.y -= 150.0f;
               }
            }
            if(score > 99)
            {
                step5 = 2;
                hitA = 0;
                hitB = 0;
                PlaySound(sound_boss_death);
            }
            if(step5 == 2)
            {
                t += 0.2;
                move = 1;
            }
        }
        //all
        if(move == 1)
        { 
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
            t += 0.005;
            position_cursor.x = -300.0f;
            position_cursor.y = -300.0f;
        }
        if(t>15.0)
        {
            move = 0;
            float temp = 14.0 - t;
            camera.position = (Vector3){ temp, -0.33f, 1.0f };
        }
        //------
        //draw
        BeginDrawing();
            ClearBackground(RAYWHITE); 
            BeginMode3D(camera);
                rlDisableBackfaceCulling();
                    DrawModel(modelMap, positionMap, 1.0f, WHITE);
                rlEnableBackfaceCulling();
                DrawModel(modelEnemy, positionEnemy1A, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy1B, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy2A, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy2B, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy3A, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy3B, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy4A, 0.1f, WHITE);
                DrawModel(modelEnemy, positionEnemy4B, 0.1f, WHITE);
                DrawModel(modelBoss, positionBoss, 0.05f, WHITE);
            EndMode3D();
            DrawTexture(splash_texture, position_cursor.x, position_cursor.y, WHITE);
            if(!(step5 == 2)) {
                DrawTexture(gun0_texture, GetScreenWidth()/2-150.0, GetScreenHeight()-350.0, WHITE);
            }
            DrawTexture(gun1_texture, GetScreenWidth()/2-150.0, gun1_texture_position_y, WHITE);
            EndDrawing();
        //----
    }
    //end
    UnloadModel(modelMap);
    UnloadModel(modelEnemy);
    UnloadModel(modelBoss);
    UnloadTexture(splash_texture);
    UnloadTexture(gun0_texture);
    UnloadTexture(gun1_texture);  
    CloseWindow();
    //---
    return 0;
}