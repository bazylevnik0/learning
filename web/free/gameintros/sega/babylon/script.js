scene.clearColor.r = 0
scene.clearColor.g = 0
scene.clearColor.b = 0

if(Tone.start()) {
	var sound_main_theme = new Tone.Player("main.mp3") .toDestination();
	    let loading_sound = setInterval( function () {
		if ( sound_main_theme.loaded ) {
 			sound_main_theme.start()
			clearInterval(loading_sound)
			animationStart();
		}
	   },100)
}

const logo_1_sprite_manager = new BABYLON.SpriteManager("logo_1_manager", "logo_1.png", 1 , {width: 900, height: 636} , scene);
const logo_1_sprite = new BABYLON.Sprite("logo_1_sprite", logo_1_sprite_manager);
const logo_2_sprite_manager = new BABYLON.SpriteManager("logo_2_manager", "logo_2.png", 1 , {width: 900, height: 636} , scene);
const logo_2_sprite = new BABYLON.Sprite("logo_2_sprite", logo_2_sprite_manager);
const logo_3_sprite_manager = new BABYLON.SpriteManager("logo_3_manager", "logo_3.png", 1 , {width: 900, height: 636} , scene);
const logo_3_sprite = new BABYLON.Sprite("logo_3_sprite", logo_3_sprite_manager);
const logo_4_sprite_manager = new BABYLON.SpriteManager("logo_4_manager", "logo_4.png", 1 , {width: 900, height: 636} , scene);
const logo_4_sprite = new BABYLON.Sprite("logo_4_sprite", logo_4_sprite_manager);
const logo_text_sprite_manager = new BABYLON.SpriteManager("logo_text_manager", "logo_text.png", 1 , {width: 900, height: 636} , scene);
const logo_text_sprite = new BABYLON.Sprite("logo_text_sprite", logo_text_sprite_manager);


logo_1_sprite.width  = logo_2_sprite.width  = logo_3_sprite.width  = logo_4_sprite.width  = logo_text_sprite.width  = 10;
logo_1_sprite.height = logo_2_sprite.height = logo_3_sprite.height = logo_4_sprite.height = logo_text_sprite.height =  6;

logo_1_sprite.position.x = -1.2
logo_2_sprite.position.x = -1.2
logo_3_sprite.position.x = -1.2
logo_4_sprite.position.x = -1.2

logo_1_sprite.position.z = -0.07
logo_2_sprite.position.z = -0.05
logo_3_sprite.position.z = -0.03
logo_4_sprite.position.z = -0.01



var box_1 = BABYLON.MeshBuilder.CreateBox("box_1", {}, scene);
    box_1.scaling.z = 0.00
    box_1.scaling.x = 2
    box_1.scaling.y = 2.25
    box_1.position.z = -0.08
    box_1.position.x = -3.4
    box_1.position.y = 2.1

var box_2 = BABYLON.MeshBuilder.CreateBox("box_2", {}, scene);
    box_2.scaling.z = 0.00
    box_2.scaling.x = 2
    box_2.scaling.y = 2.25
    box_2.position.z = -0.06
    box_2.position.x = -2.1
    box_2.position.y = 2.1

var box_3 = BABYLON.MeshBuilder.CreateBox("box_3", {}, scene);
    box_3.scaling.z = 0.00
    box_3.scaling.x = 2
    box_3.scaling.y = 2.25
    box_3.position.z = -0.04
    box_3.position.x = -0.85
    box_3.position.y = 2.1

var box_4 = BABYLON.MeshBuilder.CreateBox("box_4", {}, scene);
    box_4.scaling.z = 0.00
    box_4.scaling.x = 2
    box_4.scaling.y = 2.25
    box_4.position.z = -0.02
    box_4.position.x = 0.33
    box_4.position.y = 2.1
    
var box_text = BABYLON.MeshBuilder.CreateBox("box_text", {}, scene);
    box_text.scaling.z = 0.00
    box_text.scaling.x = 11
    box_text.scaling.y = 3
    box_text.position.z = -0.1
    box_text.position.x = 0.33
    box_text.position.y = -1


function show_logo () {
	logo_1_sprite.position.x += 0.025
	logo_2_sprite.position.x += 0.025	
	logo_3_sprite.position.x += 0.025	
	logo_4_sprite.position.x += 0.025
	
	if(logo_1_sprite.position.x > 0.2) {
		 step = false; 
		 setTimeout( function () {
			box_text.scaling.x = 0
			box_text.scaling.y = 0
		 	},800)
	}
}

function animationStart() { step = true; }
