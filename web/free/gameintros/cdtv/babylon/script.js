scene.clearColor.r = 0
scene.clearColor.g = 0
scene.clearColor.b = 0


//load & set
//back
const sprite_manager_back = new BABYLON.SpriteManager("sprite_manager_back", "back.png", 1 , {width: 900, height: 636} , scene);
const sprite_back         = new BABYLON.Sprite("back", sprite_manager_back);
      sprite_back.position.z = -1.5
      sprite_back.width  = 19
      sprite_back.height = 10

//text
BABYLON.SceneLoader.ImportMeshAsync("", "./", "text_r.obj") 
BABYLON.SceneLoader.ImportMeshAsync("", "./", "text_r.obj") 
BABYLON.SceneLoader.ImportMeshAsync("", "./", "text_r.obj") 


var text0 , text1 , text2
let loadText = setInterval( ()=> {
	if (scene.meshes.length == 9) {	
	clearInterval(loadText)
	text0 = {
		b : scene.meshes[0],
		f : scene.meshes[1],
		m : scene.meshes[2]
	}
	text1 = {
		b : scene.meshes[3],
		f : scene.meshes[4],
		m : scene.meshes[5]
	}
	text2 = {
		b : scene.meshes[6],
		f : scene.meshes[7],
		m : scene.meshes[8]
	}
	setTimeout( ()=> { setText() } , 3000)
	}
} , 100)

let material0 = new BABYLON.StandardMaterial("material0", scene);
    material0.diffuseColor  = new BABYLON.Color3(0, 0, 0);
    material0.emissiveColor = new BABYLON.Color3(154/255, 94/255, 191/255);
    material0.specularPower = 64;
    material0.alpha = 0.5;
let material1 = new BABYLON.StandardMaterial("material1", scene);
    material1.diffuseColor  = new BABYLON.Color3(0, 0, 0);
    material1.emissiveColor = new BABYLON.Color3(154/255, 94/255, 191/255);
    material1.specularPower = 64;
    material1.alpha = 0.5;
let material2 = new BABYLON.StandardMaterial("material2", scene);
    material2.diffuseColor  = new BABYLON.Color3(0, 0, 0);
    material2.emissiveColor = new BABYLON.Color3(154/255, 94/255, 191/255);
    material2.specularPower = 64;
    material2.alpha = 0.5;

function setText() {
	for (value in text0) { 
		text0[value].position.x = 1.5; 
		text0[value].position.y = 0.5; 
		text0[value].rotation.y = ( 2 * Math.PI ) / 3 
		text0[value].rotation.x = 0.025
		text0[value].scaling.x = 1.25
		text0[value].scaling.y = 1.25
		text0[value].scaling.z = 1.25
	}
	text0.f.material = material0
	text0.b.material = material0
	text0.m.material.emissiveColor = BABYLON.Color3.White()
	text0.m.material.alpha = 0.7
	
	for (value in text1) { 
		text1[value].position.x = 1.5; 
		text1[value].position.y = 0.5; 
		text1[value].rotation.y = ( 4 * Math.PI ) / 3 
		text1[value].rotation.x = 0.025
		text1[value].scaling.x = 1.25
		text1[value].scaling.y = 1.25
		text1[value].scaling.z = 1.25
	}		
	text1.f.material = material1
	text1.b.material = material1
	text1.m.material.emissiveColor = BABYLON.Color3.White()
	text1.m.material.alpha = 0.7
 
	for (value in text2) { 
		text2[value].position.x = 1.5; 
		text2[value].position.y = 0.5; 
		text2[value].rotation.y = ( 6 * Math.PI ) / 3 
		text2[value].rotation.x = 0.025
		text2[value].scaling.x = 1.25
		text2[value].scaling.y = 1.25
		text2[value].scaling.z = 1.25
	}
		
	text2.f.material = material2
	text2.b.material = material2
	text2.m.material.emissiveColor = BABYLON.Color3.White()
	text2.m.material.alpha = 0.7
	

	sprite_back.position.z = 1.5
    	start = true
}


//main
const sprite_manager_main = new BABYLON.SpriteManager("sprite_manager_main", "main.png", 1 , {width: 900, height: 636} , scene);
const sprite_main         = new BABYLON.Sprite("main", sprite_manager_main);
      sprite_main.position.z = -1.4
      sprite_main.position.y = -1.2
      sprite_main.width  = 11
      sprite_main.height = 7

//laser
var sprites_laser = {
	managers: {
		laser_a    : new BABYLON.SpriteManager("sprite_manager_laser_a"  , "laser_a.png"  , 1 , {width: 900, height: 636} , scene) ,
		laser_b    : new BABYLON.SpriteManager("sprite_manager_laser_b"  , "laser_b.png"  , 1 , {width: 900, height: 636} , scene) ,
		laser_eff  : new BABYLON.SpriteManager("sprite_manager_laser_eff", "laser_eff.png", 1 , {width: 900, height: 636} , scene) ,
		blick      : new BABYLON.SpriteManager("sprite_manager_blick"    , "blick.png"    , 1 , {width: 900, height: 636} , scene) ,
		light_a    : new BABYLON.SpriteManager("sprite_manager_light_a"  , "light_a.png"  , 1 , {width: 900, height: 636} , scene) ,
		light_b    : new BABYLON.SpriteManager("sprite_manager_light_b"  , "light_b.png"  , 1 , {width: 900, height: 636} , scene) ,
		light_c    : new BABYLON.SpriteManager("sprite_manager_light_c"  , "light_c.png"  , 1 , {width: 900, height: 636} , scene)
	}
}
var loadLaser = setInterval( function () {
	if (sprites_laser.managers.light_c !== undefined ) {
	clearInterval(loadLaser)
	sprites_laser.sprites =  {
		laser_a    : new BABYLON.Sprite("laser_a"  , sprites_laser.managers.laser_a) ,
		laser_b    : new BABYLON.Sprite("laser_b"  , sprites_laser.managers.laser_b) ,
		laser_eff  : new BABYLON.Sprite("laser_eff", sprites_laser.managers.laser_eff) ,
		blick      : new BABYLON.Sprite("blick"    , sprites_laser.managers.blick) ,
		light_a    : new BABYLON.Sprite("light_a"  , sprites_laser.managers.light_a) ,
		light_b    : new BABYLON.Sprite("light_b"  , sprites_laser.managers.light_b) ,
		light_c    : new BABYLON.Sprite("light_c"  , sprites_laser.managers.light_c)
		}
	}
	
	for (value in sprites_laser.sprites) {
		sprites_laser.sprites[value].width = 15
		sprites_laser.sprites[value].height = 7
		sprites_laser.sprites[value].position.z = -1.5
		sprites_laser.sprites[value].position.x = -0.25
		sprites_laser.sprites[value].position.y = -0.8
		sprites_laser.sprites[value].width = 0
	}

	let animate_wait = setInterval( ()=> {
		if (start) {
			clearInterval(animate_wait)
			animateLaser()
		}
	},100)
},100)
function animateLaser() {
		for (value in sprites_laser.sprites) {
			sprites_laser.sprites[value].width = 15
		}
		let animate_laser = setInterval( function() {
			let n = Math.floor(Math.random()*2)
			switch (n) {
				case 0 : {
					sprites_laser.sprites.laser_a.width = 0
					sprites_laser.sprites.laser_b.width = 15
				} break;
				case 1 : {
					sprites_laser.sprites.laser_a.width = 15
					sprites_laser.sprites.laser_b.width = 0
				} break;
			}
		},50)
		let animate_light = setInterval( function() {
			let n = Math.floor(Math.random()*3)
			switch (n) {
				case 0 : {
					sprites_laser.sprites.light_a.width = 15
					sprites_laser.sprites.light_b.width = 0
					sprites_laser.sprites.light_c.width = 0
				} break;
				case 1 : {
					sprites_laser.sprites.light_a.width = 0
					sprites_laser.sprites.light_b.width = 15
					sprites_laser.sprites.light_c.width = 0
				} break;
				case 2 : {
					sprites_laser.sprites.light_a.width = 0
					sprites_laser.sprites.light_b.width = 0
					sprites_laser.sprites.light_c.width = 15
				} break;
			}
		},10)
}
