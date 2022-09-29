var green = document.getElementById("container_green")
var red   = document.getElementById("container_red")
var sweet = document.getElementById("container_sweet")
//category
document.querySelectorAll(".btn_green").forEach(el=>el.addEventListener("click",()=>changeCategory("green")))
document.querySelectorAll(".btn_red").forEach(el=>el.addEventListener("click",()=>changeCategory("red")))
document.querySelectorAll(".btn_sweet").forEach(el=>el.addEventListener("click",()=>changeCategory("sweet")))

function changeCategory( type ){
  switch(type){
    case "green" : {
      _setProperty(red  ,"-1","0.0","absolute","none");
      _setProperty(sweet,"-1","0.0","absolute","none");
      _setProperty(green,"1" ,"1.0","relative","block");
    } break;
    case "red" : {
      _setProperty(red  ,"1" ,"1.0","relative","block");
      _setProperty(green,"-1","0.0","absolute","none");
      _setProperty(sweet,"-1","0.0","absolute","none");
    } break;
    case "sweet" : {
      _setProperty(sweet ,"1" ,"1.0","relative","block");
      _setProperty(green ,"-1","0.0","absolute","none");
      _setProperty(red   ,"-1","0.0","absolute","none");
    } break;
  }
  function _setProperty(obj,z,o,p,d) {
      obj.style.position = p;  
    obj.style.zIndex   = z;
      obj.style.opacity  = o;
      obj.style.display = d;
  }
}

//product
var green_c , red_c , sweet_c
    green_c = red_c = sweet_c = 0;
document.querySelectorAll(".col").forEach(el=>el.addEventListener("click", function () {
  if (this.classList.contains("selected")) {
      this.classList.remove("selected")
      this.classList.contains("green") ? green_c-- : false;
      this.classList.contains("red") ? red_c-- : false;
      this.classList.contains("sweet") ? sweet_c-- : false;
  } else {
      this.classList.add("selected")
      this.classList.contains("green") ? green_c++ : false;
      this.classList.contains("red") ? red_c++ : false;
      this.classList.contains("sweet") ? sweet_c++ : false;
  }
}))

//send
var pay  = document.getElementById("container_pay")
var code_r = document.getElementById("code_r")
var code_g = document.getElementById("code_g")
var code_b = document.getElementById("code_b")
//sale
document.querySelectorAll(".btn_sale").forEach(el=>el.addEventListener("click", function () {
  pay.style.zIndex = "2";
  pay.style.opacity = "1.0";
  //calculate color code
  console.log(red_c,green_c,sweet_c)
  let size_sum = red_c + green_c + sweet_c
  let size_red   = (100 / size_sum) * red_c
  let size_green = (100 / size_sum) * green_c
  let size_sweet  = (100 / size_sum) * sweet_c
  code_r.style.width = "" + parseInt(size_red) +"px"
  code_g.style.width = "" + parseInt(size_green) +"px"
  code_b.style.width = "" + parseInt(size_sweet) +"px"
}))
//pay
document.getElementById("btn_pay").addEventListener("click", function () {
  pay.style.zIndex = "-1";
  pay.style.opacity = "0.0";
})

changeCategory( "sweet" )

//3d

BABYLON.SceneLoader.ShowLoadingScreen = false;
//meal
   const canvas_meal = document.getElementById("meal"); 
   const engine_meal = new BABYLON.Engine(canvas_meal, true); // Generate the BABYLON 3D engine

        const createScene_meal = function () {
    
            const scene_meal = new BABYLON.Scene(engine_meal);  
      scene_meal.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  
            const camera_meal = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
            const light_meal = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
          
            return scene_meal;
        };

const scene_meal = createScene_meal();


// Append glTF model to scene.
BABYLON.SceneLoader.Append("https://bazylevnik0.github.io/practice/web/3dmenu/meal/", "scene.gltf", scene_meal, function (scene) {
      scene.createDefaultCameraOrLight(true, true, true);
      scene.activeCamera.alpha += Math.PI;
      scene.meshes[0].rotationQuaternion = null;
      scene.meshes[0].rotation.x += 0.3
      scene.meshes[0].rotation.y -= 0.9
      scene.meshes[0].scaling.x = 1.25
      scene.meshes[0].scaling.y = 1.25
      scene.meshes[0].scaling.z = 1.25
    });
        engine_meal.runRenderLoop(function () {
   	scene_meal.render();
        });

//water
   const canvas_water = document.getElementById("water"); 
   const engine_water = new BABYLON.Engine(canvas_water, true); 

        const createScene_water = function () {
    
            const scene_water = new BABYLON.Scene(engine_water);  
   scene_water.clearColor = new BABYLON.Color4(0, 0, 0, 0);
   
            const camera_water = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
            const light_water = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

            return scene_water;
        };

	const scene_water = createScene_water();
 BABYLON.SceneLoader.Append("https://bazylevnik0.github.io/practice/web/3dmenu/water/", "scene.gltf", scene_water, function (scene) {

      scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.alpha += Math.PI;
   scene.meshes[0].rotationQuaternion = null;
      let rotateWater = setInterval(function () {
        scene.meshes[0].rotation.y += 0.05;
      },25)
    });
          

        engine_water.runRenderLoop(function () {
     
          scene_water.render();
        });


//both
  window.addEventListener("resize", function () {
                engine_meal.resize();
     engine_water.resize();
  
        });
