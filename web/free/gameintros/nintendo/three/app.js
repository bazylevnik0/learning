import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

//import * as Tone from "https://cdn.skypack.dev/tone"
let sound = new Audio("sound.mp3")
    sound.play();
//load scene & renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const light = new THREE.AmbientLight( 0x404040 );
scene.add( light );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

//load sky sprites
var maps_sky = {};
    maps_sky.space_a  = new THREE.TextureLoader().load( 'space_a.png'  );
    maps_sky.space_b  = new THREE.TextureLoader().load( 'space_b.png'  );
    maps_sky.space_c  = new THREE.TextureLoader().load( 'space_c.png'  );
    maps_sky.space_aa = new THREE.TextureLoader().load( 'space_aa.png' );
    maps_sky.space_bb = new THREE.TextureLoader().load( 'space_bb.png' );
    maps_sky.space_cc = new THREE.TextureLoader().load( 'space_cc.png' );


var materials_sky = {};
    materials_sky.space_a  = new THREE.SpriteMaterial( { map: maps_sky.space_a  } );
    materials_sky.space_b  = new THREE.SpriteMaterial( { map: maps_sky.space_b  } );
    materials_sky.space_c  = new THREE.SpriteMaterial( { map: maps_sky.space_c  } );
    materials_sky.space_aa = new THREE.SpriteMaterial( { map: maps_sky.space_aa } );
    materials_sky.space_bb = new THREE.SpriteMaterial( { map: maps_sky.space_bb } );
    materials_sky.space_cc = new THREE.SpriteMaterial( { map: maps_sky.space_cc } );

var sprites_sky = {}
    sprites_sky.space_a  = new THREE.Sprite( materials_sky.space_a  );
    sprites_sky.space_b  = new THREE.Sprite( materials_sky.space_b  );
    sprites_sky.space_c  = new THREE.Sprite( materials_sky.space_c  );
    sprites_sky.space_aa = new THREE.Sprite( materials_sky.space_aa );
    sprites_sky.space_bb = new THREE.Sprite( materials_sky.space_bb );
    sprites_sky.space_cc = new THREE.Sprite( materials_sky.space_cc );

let acc = 0.3
for ( let sprite in sprites_sky) {
	(Math.floor(Math.random()*2) == 0) ? sprites_sky[sprite].scale.x  = 13 : sprites_sky[sprite].scale.x  = 17;
	(Math.floor(Math.random()*2) == 0) ? sprites_sky[sprite].scale.y  = 9  : sprites_sky[sprite].scale.y  = 7;
	scene.add( sprites_sky[sprite])
	sprites_sky[sprite].material.opacity = acc;
	acc += 0.1;
	sprites_sky[sprite+"_clone"] = sprites_sky[sprite].clone();
	sprites_sky[sprite+"_clone"].opacity = 1 - acc;
	sprites_sky[sprite+"_clone"].position.y = -4;
	scene.add(sprites_sky[sprite+"_clone"])
}


//load main sprites
const map_sprite_line       = new THREE.TextureLoader().load( 'line.png'  );
const map_sprite_rectangle  = new THREE.TextureLoader().load( 'rectangle.png'  );
const map_sprite_key        = new THREE.TextureLoader().load( 'key.png'  );
const map_sprite_indicator  = new THREE.TextureLoader().load( 'indicator.png'  );
const map_sprite_logo       = new THREE.TextureLoader().load( 'logo.png'  );
const map_sprite_logo_blick = new THREE.TextureLoader().load( 'logo_blick.png'  );
const map_sprite_text       = new THREE.TextureLoader().load( 'text.png'  );

const material_sprite_line       = new THREE.SpriteMaterial( { map: map_sprite_line  } );
const material_sprite_rectangle  = new THREE.SpriteMaterial( { map: map_sprite_rectangle  } );
const material_sprite_key        = new THREE.SpriteMaterial( { map: map_sprite_key  } );
const material_sprite_indicator  = new THREE.SpriteMaterial( { map: map_sprite_indicator  } );
const material_sprite_logo       = new THREE.SpriteMaterial( { map: map_sprite_logo  } );
const material_sprite_logo_blick = new THREE.SpriteMaterial( { map: map_sprite_logo_blick  } );
const material_sprite_text       = new THREE.SpriteMaterial( { map: map_sprite_text  } );

var sprites_table = []
var sprite_line       = new THREE.Sprite( material_sprite_line  );
    sprite_line.scale.x = 16
    sprite_line.scale.y = 8
    sprite_line.visible = false
var sprite_rectangle  = new THREE.Sprite( material_sprite_rectangle  );
    sprite_rectangle.scale.x = 16
    sprite_rectangle.scale.y = 8
    sprite_rectangle.position.y = 6
var sprite_key        = new THREE.Sprite( material_sprite_key  );
    sprite_key.scale.x = 16
    sprite_key.scale.y = 8
    sprite_key.position.y = 6
var sprite_indicator  = new THREE.Sprite( material_sprite_indicator  );
    sprite_indicator.scale.x = 16
    sprite_indicator.scale.y = 8
    sprite_indicator.position.y = 6
    sprite_indicator.material.color.r = 1
    sprite_indicator.material.color.g = 0
    sprite_indicator.material.color.b = 0
var sprite_logo       = new THREE.Sprite( material_sprite_logo  );
    sprite_logo.scale.x = 16
    sprite_logo.scale.y = 8
    sprite_logo.position.y = 6
var sprite_logo_blick       = new THREE.Sprite( material_sprite_logo_blick  );
    sprite_logo_blick.scale.x = 16
    sprite_logo_blick.scale.y = 8
    sprite_logo_blick.position.y = 6
    sprite_logo_blick.material.opacity = 0.6
var sprite_text       = new THREE.Sprite( material_sprite_text  );
    sprite_text.scale.x = 16
    sprite_text.scale.y = 8
    sprite_text.position.y = 6

scene.add( sprite_line );
scene.add( sprite_rectangle );
scene.add( sprite_key );
scene.add( sprite_indicator );
scene.add( sprite_logo );
scene.add( sprite_logo_blick );
scene.add( sprite_text );

sprites_table.push( sprite_rectangle );
sprites_table.push( sprite_key );
sprites_table.push( sprite_indicator );
sprites_table.push( sprite_logo );
sprites_table.push( sprite_logo_blick );
sprites_table.push( sprite_text )

//load char sprites
//mario
var maps_m = {};
    maps_m.stay_l = new THREE.TextureLoader().load( 'm_stay_l.png'  )
    maps_m.run1_l = new THREE.TextureLoader().load( 'm_run1_l.png'  )
    maps_m.run2_l = new THREE.TextureLoader().load( 'm_run2_l.png'  );
    maps_m.jump_l = new THREE.TextureLoader().load( 'm_jump_l.png'  );
    maps_m.stay_r = new THREE.TextureLoader().load( 'm_stay_r.png'  )
    maps_m.run1_r = new THREE.TextureLoader().load( 'm_run1_r.png'  )
    maps_m.run2_r = new THREE.TextureLoader().load( 'm_run2_r.png'  );
    maps_m.jump_r = new THREE.TextureLoader().load( 'm_jump_r.png'  );

const material_start_m_l = new THREE.SpriteMaterial( { map: maps_m.stay_l  } );
var sprite_char_m = new THREE.Sprite( material_start_m_l  );
    sprite_char_m.position.y = -2.175;
    sprite_char_m.position.x = -9;
scene.add( sprite_char_m );
//luigi
var maps_l = {};
    maps_l.stay_l = new THREE.TextureLoader().load( 'l_stay_l.png'  )
    maps_l.run1_l = new THREE.TextureLoader().load( 'l_run1_l.png'  )
    maps_l.run2_l = new THREE.TextureLoader().load( 'l_run2_l.png'  );
    maps_l.jump_l = new THREE.TextureLoader().load( 'l_jump_l.png'  );
    maps_l.stay_r = new THREE.TextureLoader().load( 'l_stay_r.png'  )
    maps_l.run1_r = new THREE.TextureLoader().load( 'l_run1_r.png'  )
    maps_l.run2_r = new THREE.TextureLoader().load( 'l_run2_r.png'  );
    maps_l.jump_r = new THREE.TextureLoader().load( 'l_jump_r.png'  );

const material_start_l_r = new THREE.SpriteMaterial( { map: maps_l.stay_r } );
var sprite_char_l = new THREE.Sprite( material_start_l_r  );
    sprite_char_l.position.y = -2.175;
    sprite_char_l.position.x = 9;
scene.add( sprite_char_l );


//animate
var light_direction = "+"

sprite_char_l.material.opacity = 0.0
sprite_char_m.material.opacity = 0.0
sprite_char_m.direction = "r"
sprite_char_l.direction = "l"
sprite_char_m.stop = sprite_char_l.stop = true
sprite_char_l.step = sprite_char_m.step = 1
sprite_char_l.maps = maps_l
sprite_char_m.maps = maps_m
var move_m ,move_l
move_m = move_l = 0

var chars = {
	m : sprite_char_m,
	l : sprite_char_l
}
let show_start = true
const animate = function () {
	requestAnimationFrame( animate );
	//
	//cycle
	chars.m.position.x+=move_m
	chars.l.position.x+=move_l
	colorBlink( sprite_line , sprite_rectangle , sprite_logo );
	for ( let sprite in sprites_sky) {
		spaceMove ( sprites_sky[sprite] )
		spaceBlink( sprites_sky[sprite] )
	}
	//start
	if (sprites_table[0].position.y > 0) {
		 sprites_table.forEach( el => el.position.y -= 0.025) 
	} else show_start == true ? show() : false	
	//
	renderer.render( scene, camera );
};

//show
function show () {
	show_start = false
	//show line in up and down
	sprite_line.visible = true;
	//activate indincatorBlink with speed 100(its start default time)
	pause_indicatorBlink = false;
	//stop colorBlink
	pause_colorBlink = true;
	//change main color to blue
	sprite_rectangle.material.color.set(0x1f36d7);
	sprite_line     .material.color.set(0x1f36d7);
	sprite_logo     .material.color.set(0x0c98fe);
	//luigi from right side to center and jump and...
	let show_0 = setInterval( function () {
			chars.l.stop = false;
			chars.l.material.opacity += 0.025;
			if( chars.l.position.x > 0) {
				chars.l.position.x -= 0.1
			} else {
				clearInterval(show_0)
				jump(chars.l)
				//...and change main colors
				setTimeout( function() {
					sprite_rectangle.material.color.set(0x000000);
					sprite_line     .material.color.set(0x0f16a7);
					sprite_logo     .material.color.set(0x1f36d7);
					pause_indicatorBlink = true
					sprite_indicator.material.color.set(0x0f16a7);
					//change luigi direcrion to right and run
					setTimeout( function() {
						chars.l.direction = "r"
						let show_1 = setInterval( function () {
							if( chars.l.position.x < 9) {
								chars.l.position.x += 0.1
							} else {
								clearInterval(show_1)
								//mario from left side go to center and jump & ...
								let show_2 = setInterval( function () {
									chars.m.stop = false;
									chars.m.material.opacity += 0.025;
									if( chars.m.position.x < 0) {
										chars.m.position.x += 0.1
									} else {
										clearInterval(show_2)
										jump(chars.m)
										//...and change main colors
										setTimeout( function() {
											sprite_rectangle.material.color.set(0xde3336);
											sprite_line     .material.color.set(0xff87a6);
											sprite_logo     .material.color.set(0xff86a6);
											pause_indicatorBlink = false
											sprite_indicator.material.color.set(0xff86a6);
											//change mario direcrion to left and run
											chars.m.direction = "l"
											let show_3 = setInterval( function () {
												if( chars.m.position.x > -9) {
													chars.m.position.x -= 0.1
												} else {
													clearInterval(show_3)
												}
											},50)
										},500);
									}
					    			},50)
					         	}
					        },50)
				        },500)
			        },50)
			}
	},50);
}

//run
let run_m = setInterval( runningChars , 100)
let run_l = setInterval( runningChars , 100)
function runningChars () {
		for ( let obj in chars ) {
			 let char = chars[obj]
			if ( char.stop == true ) {
				switch ( char.direction ) {
					case "l" : char.jump == true ? char.material.map = char.maps.jump_l : char.material.map = char.maps.stay_l; break;
					case "r" : char.jump == true ? char.material.map = char.maps.jump_r : char.material.map = char.maps.stay_r; break;
				}
			} else {
				switch ( char.direction ) {
					case "l" : {
						switch (char.step){
							case 3 : { char.material.map = char.maps.run1_l ; char.step  = 1 ; }; break;
							case 2 : { char.material.map = char.maps.stay_l ; char.step += 1 ; }; break;
							case 1 : { char.material.map = char.maps.run2_l ; char.step += 1 ; }; break;
						}
					} break;
					case "r" : {
						switch (char.step){
							case 3 : { char.material.map = char.maps.run1_r ; char.step  = 1 ; }; break;
							case 2 : { char.material.map = char.maps.stay_r ; char.step += 1 ; }; break;
							case 1 : { char.material.map = char.maps.run2_r ; char.step += 1 ; }; break;
						}
					} break;
				}
			}
		}
}

//jump
function jump (char) {
	let prev = char.stop;
	char.jump = true;
	char.stop = true;
	switch ( char.direction ) {
		case "l" : char.material.map = char.maps.jump_l; break;
		case "r" : char.material.map = char.maps.jump_r; break;
	}
	char.up = setInterval( function () {
		if (char.position.y < -1.5 ) {
			 char.position.y += 0.1;
		} else {
			clearInterval(char.up)
			char.down = setInterval( function () {
				if (char.position.y > -2.175 ) {
				 	char.position.y -= 0.1;
				} else {
					clearInterval(char.down)
					switch ( char.direction ) {
						case "l" : char.material.map = char.maps.stay_l; break;
						case "r" : char.material.map = char.maps.stay_r; break;
					}
					char.jump = false;
					char.stop = prev;
				}
			}, 50)
		}
	}, 50)
}

//other
let  time_indicatorBlink = 100
let pause_indicatorBlink = true;
sprite_indicator.material.color.r = 1
let indicatorBlink = setInterval( function() {
				if (pause_indicatorBlink == false) {
					sprite_indicator.material.color.r = 1;
					sprite_indicator.material.color.g = 0;
					sprite_indicator.material.color.b = 0;
					setTimeout( function () {
							sprite_indicator.material.color.r = 0;
						} , time_indicatorBlink)
				}
				} , time_indicatorBlink*2);
let textBlink = setInterval( function() {
					sprite_text.visible = true;
					setTimeout( function () {
							sprite_text.visible = false;
						} , 500)
				} , 1000);
var pause_colorBlink = false;
function colorBlink() {
	if (pause_colorBlink == false) {
		for (let i = 0; i < arguments.length; i++) {
			arguments[i].material.color.r = +Math.random().toPrecision(2)
			arguments[i].material.color.g = +Math.random().toPrecision(2)
			arguments[i].material.color.b = +Math.random().toPrecision(2)
		}
		sprite_logo_blick.material.color.set(0xffffff)
	}
}
function spaceBlink( sprite ) {
	switch(light_direction) {
		case "+" : sprite.material.opacity > 0.95 ? light_direction = "-" : sprite.material.opacity += 0.015; break
		case "-" : sprite.material.opacity < 0.05 ? light_direction = "+" : sprite.material.opacity -= 0.015; break
	}
}

function spaceMove( sprite ) {
	sprite.position.y > 6 ? sprite.position.y = -6 : sprite.position.y += 0.01
}

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
