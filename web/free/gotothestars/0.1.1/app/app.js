console.log("app.js");
import * as TOOLS from './tools.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js'

import {OBJLoader}      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader}      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js';
import {EffectComposer} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass}     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass}      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js';
import {FilmPass}       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

var score ,         process ,         move_array ,		                                    //game
    pointer ,       raycaster , 				                                    //control
    loader ,        loader_material , loader_texture , loader_font,                                 //loaders obj&material&imgtexture
    video ,         texture_video ,   map_glow ,		                                    //domvideo, videotexture, glowshader
    camera ,        scene ,           scene_nav     ,light ,          light_ambient ,               //scene objects
    temp_material , temp_sprite,      temp_position ,  temp_text      , temp_font , temp_render;    //temp objects

scene     = new THREE.Scene();
scene_nav = new THREE.Scene();
load();

//states of process
function processing () {
	if (process === "intro") {

	}
	if (process === "nav") {
		temp_render = "nav";
	
	}
	if (process === "game") {
		temp_render = "game";
		show();
	}
}

process = "game";
let temp_processing = undefined;
let check = setInterval( function() {
				if (scene.children[2] !== undefined) {
					if (temp_processing !== process) {
						temp_processing = process;
						processing();
					}
				}
			 } , 100 );

//control
document.addEventListener( 'mousedown', mouse_down );
function mouse_down( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( pointer, camera );
	let intersection = raycaster.intersectObject( scene.children[2], true );
	let intersection_nav = raycaster.intersectObject( scene_nav.children[3], false );
	if ( intersection.length >= 0 ) {
		if ( intersection[ 0 ].object.material.changeable === 1 ) {
			intersection[ 0 ].object.material.color.r = Math.random();
			intersection[ 0 ].object.material.color.g = Math.random();
			intersection[ 0 ].object.material.color.b = Math.random();
			choice( intersection[ 0 ].object );
			show_score();
		}
	}
	if ( intersection_nav.length >= 0 ) {

		if ( intersection_nav[ 0 ].object.button == "exit" ) {
			alert("button exit work");
		}
	}
}	

//переделать и добавить движение при движении устройства
temp_position = {};
document.addEventListener('mousemove', screen_move );
document.addEventListener('touchmove', screen_move );
function screen_move( event ) {
	temp_position.x = event.clientX;
	temp_position.y = event.clientY;
	if (temp_position.x > window.innerWidth/2 ) {
		camera.position.x += 0.000001 * temp_position.x;
	} else 	camera.position.x -= 0.000001 * temp_position.x;
	if (temp_position.y > window.innerHeight/2 ) {
		camera.position.y += 0.000001 * temp_position.y;
	} else 	camera.position.y -= 0.000001 * temp_position.y;
}

window.addEventListener('keydown', function(e){
    if(e.key=='Escape'||e.key=='Esc'||e.keyCode==27){
      if (process == "nav") process = "game";
	else if (process == "game") process = "nav";
   }
}, true);

//prerender
const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

//postprocessing
const bloomPass = new BloomPass(
    1.875,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);

const filmPass = new FilmPass(
    0.125,   // noise intensity
    0.025,  // scanline intensity
    648,    // scanline count
    false,  // grayscale
);

const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

filmPass.renderToScreen = true;
composer.addPass(bloomPass);
composer.addPass(filmPass);

//render
var inhale = true, exhale = false, size = 1;
const animate = function () {
	requestAnimationFrame( animate );

	//life
	 if (inhale === true) {
			size -= 0.01;
			if (size > -0.5) {
				//cloudleft1
				scene.children[2].children[8].position.y -= 0.000475;
				//cloudleft2
				scene.children[2].children[9].position.y += 0.000475;
				//water step1
				scene.children[2].children[17].position.y += 0.000225;
				//water step2
				scene.children[2].children[18].position.y += 0.000225;
				//water plane
				scene.children[2].children[19].position.z += 0.000225;
			} else { inhale = false; exhale =  true; }
	 }
	 if (exhale === true) {
			size += 0.01; 
			if (size < 0.5) {
				//cloudleft1
				scene.children[2].children[8].position.y += 0.000475;
				//cloudleft2
				scene.children[2].children[9].position.y -= 0.000475;
				//water step1
				scene.children[2].children[17].position.y -= 0.000225;
				//water step2
				scene.children[2].children[18].position.y -= 0.000225;
				//water plane
				scene.children[2].children[19].position.z -= 0.000225;
			} else { inhale = true; exhale =  false; }
	 }

	move();

	//render
	if (temp_render == "nav") {
		renderer.autoClear = false;
		renderer.clear();
		renderer.clearDepth();
  		camera.layers.set(0);
  	
		renderer.render(scene_nav, camera);
	}
	if (temp_render == "game") {
		renderer.autoClear = false;
		renderer.clear();

		renderer.clearDepth();

		camera.layers.set(1);
  		composer.render();

  		renderer.clearDepth();
  		camera.layers.set(0);
  		renderer.render(scene, camera);
	}
};

function load() {
	score = 0;
	process = undefined;
	move_array = [];

	pointer = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	loader = new OBJLoader();
	loader_material = new MTLLoader();
	loader_texture = new THREE.TextureLoader();
	video = document.getElementById( 'video' );
	texture_video = new THREE.VideoTexture( video );
	map_glow = loader_texture.load( "./src/images/glow.png" );
	loader_font = new THREE.FontLoader();

	loader_material.load('./src/objects/all.mtl', function( material ) {
						     	material.preload();
						     	loader.setMaterials( material );
						     	loader.load('./src/objects/all.obj', (object) => {
													scene.add(object);
						     						}
						       		   );
					     		}
			    );
	//go to init
	init();
}

function init() {
	//camera
	camera = new THREE.PerspectiveCamera( 75 , window.innerWidth / window.innerHeight , 0.1 , 1000 );
	camera.layers.enable(0); 
	camera.layers.enable(1);
	camera.rotation.set( -0.3 , 0 , 0 );
	camera.position.set(  0 ,  -4 , 6 );	
	//light
	light = new THREE.PointLight( 0xffffff , 1 , 25 );
    	light.position.set( 0 , -2.5 , +2.5 );
    	light.layers.enable(0);
    	light.layers.enable(1);
    	scene.add(light)
	scene_nav.add(light.clone())
	//ambient light
	light_ambient = new THREE.AmbientLight( 0x404040 );
    	light_ambient.layers.enable(0);
    	light_ambient.layers.enable(1);
    	scene.add(light_ambient);
	scene_nav.add(light_ambient.clone());
	//main objects group
	let loading = setInterval( function() { 
				 	if (scene.children[2] !== undefined) { 
						console.log(scene);
						clearInterval(loading);
						//set start position & settings
							//set clear under color
								//portal right out
								scene.children[2].children[0].material.color.r = 1;
								scene.children[2].children[0].material.color.g = 1;
								scene.children[2].children[0].material.color.b = 1;
								//portal left out
								scene.children[2].children[1].material.color.r = 1;
								scene.children[2].children[1].material.color.g = 1;
								scene.children[2].children[1].material.color.b = 1;
								//back
								scene.children[2].children[4].material.color.r = 1;
								scene.children[2].children[4].material.color.g = 1;
								scene.children[2].children[4].material.color.b = 1;
							//set base color
								//game object cube
								scene.children[2].children[2].material.color.r = 1;
								scene.children[2].children[2].material.color.g = 1;
								scene.children[2].children[2].material.color.b = 0;
								//game object sphere
								scene.children[2].children[3].material.color.r = 1;
								scene.children[2].children[3].material.color.g = 1;
								scene.children[2].children[3].material.color.b = 0;
							//set normal maps
								//portal right out
								scene.children[2].children[0].material.normalMap = loader_texture.load( './src/objects/normal.png' );
								//portal left out
								scene.children[2].children[1].material.normalMap = loader_texture.load( './src/objects/normal.png' );
							//set effects
								//video texture
									//portal right in
									scene.children[2].children[5].material = new THREE.MeshBasicMaterial( {map: texture_video, color: 0xffffff} );
									//portal left in
									scene.children[2].children[6].material = new THREE.MeshBasicMaterial( {map: texture_video, color: 0xffffff} );
								//shader glow
									//game object cube
									temp_material = new THREE.SpriteMaterial( { map: map_glow, color: 0xffff00, fog: true  , transparent: true , blending: THREE.AdditiveBlending } ); 
									temp_sprite =  new THREE.Sprite( temp_material );
									temp_sprite.scale.set(3,3,3)
									scene.children[2].children[2].add( temp_sprite );
									//game object sphere
									temp_material = new THREE.SpriteMaterial( { map: map_glow, color: 0xffff00, fog: true  , transparent: true , blending: THREE.AdditiveBlending } ); 
									temp_sprite =  new THREE.Sprite( temp_material );
									temp_sprite.scale.set(3,3,3)
									scene.children[2].children[3].add( temp_sprite );
							//set start position & scale
								scene.children[2].scale.set( 5, 5, 5 );
								scene.children[2].position.set( 0, -7, 0 );
							 	scene.children[2].rotation.y = 4;
						  	//set statuses 		
								//set info about changeable
									//portal right in
									scene.children[2].children[5].material.changeable = 1;
									//portal left in
									scene.children[2].children[6].material.changeable = 1;
								//set info about form
									//game objects
									scene.children[2].children[2].form = "cube";
									scene.children[2].children[3].form = "sphere";
									//portal right in
									scene.children[2].children[5].form = "cube";
									//portal left in
									scene.children[2].children[6].form = "sphere";





									//scene2
									let geometryOUT = new THREE.PlaneGeometry(2, 2);
									 let materialOUT = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
									 let meshOUT = new THREE.Mesh( geometryOUT, materialOUT );
meshOUT.position.set(0,-5,4);
scene_nav.add(meshOUT);	
let geometryIN = new THREE.PlaneGeometry(1, 1);
									 let materialIN = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
									 let meshIN = new THREE.Mesh( geometryIN, materialIN );
meshIN.position.set(0,-4.75,4.5);
meshIN.button = "exit";
scene_nav.add(meshIN);





//!!!!переделать

	temp_text = "score: " + score + " !";
	loader_font.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
	let text = temp_text;  // ui: text
  let geometry = new THREE.TextGeometry(text, {
    font: font,
    size: 3,  // ui: size
    height: 0.2,  // ui: height
    curveSegments: 12,  // ui: curveSegments
    bevelEnabled: true,  // ui: bevelEnabled
    bevelThickness: 0.15,  // ui: bevelThickness
    bevelSize: 0.3,  // ui: bevelSize
    bevelSegments: 5,  // ui: bevelSegments
  });
  let material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
 let mesh = new THREE.Mesh( geometry, material );
mesh.position.set(-0.5,-5,4);
mesh.scale.set(0.05,0.05,0.05);
mesh.visible = false;
scene.add(mesh);

});	
	
 	
					//listening resize window event				
					window.addEventListener( 'resize', onWindowResize, false );
					//run animate
					animate();
				 	} 
				 } , 1000 );
}

//extra
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

//logic
var game_object;
function show () {
	//hide game objects
	scene.children[2].children[2].visible = false;
	scene.children[2].children[3].visible = false;
	//set game objects to start position 
	scene.children[2].children[2].position.set( 0.25 , 0.05 , -0.25 );
	scene.children[2].children[3].position.set( 0.25 , 0.05 , -0.25 );
	//collect game objects to array
	let objects = [ scene.children[2].children[2] , scene.children[2].children[3] ];
	//choose random game object
	game_object = objects[ Math.round(Math.random()) ];
	game_object.visible = true;
	//add game object  to animation move array
	move_array.push( [game_object, new THREE.Vector3( 0.125 , -0.25 , -0.125 ) , 0.01] );

}

function show_score () {
		
//!!!!переделать
if (scene.children[3] !== undefined ) {

	temp_text = "score: " + score + " !";
	loader_font.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
	let text = temp_text;  // ui: text
  let geometry = new THREE.TextGeometry(text, {
    font: font,
    size: 3,  // ui: size
    height: 0.2,  // ui: height
    curveSegments: 12,  // ui: curveSegments
    bevelEnabled: true,  // ui: bevelEnabled
    bevelThickness: 0.15,  // ui: bevelThickness
    bevelSize: 0.3,  // ui: bevelSize
    bevelSegments: 5,  // ui: bevelSegments
  });
  let material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
 let mesh = new THREE.Mesh( geometry, material );
mesh.position.set(-0.5,-5,4);
mesh.scale.set(0.05,0.05,0.05);
scene.children[3] = mesh;
});	
	
}

scene.children[3].position.set(-0.5,-5, 4);
scene.children[3].visible = true;;
setTimeout(function(){ scene.children[3].visible = false; }, 1500);

	/*
	temp_text = "score: " + score + "!";
	
	let geometry = new THREE.TextGeometry( temp_text, {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );

	*/
}

function choice ( select ) {
	if ( game_object.form === select.form ) {
		++score;
		game_object.position.set( 0.4 , -0.4 , -0.4 );
		if ( select.form === "sphere") {
			move_array.push( [game_object, new THREE.Vector3( 0.65 , -0.7 , -0.2 ) , 0.01] );
		}
		if ( select.form === "cube") {
			move_array.push( [game_object, new THREE.Vector3( -0.1 , -0.8 , -0.8 ) , 0.01] );
		}
		show_score();
		setTimeout(function(){ show() }, 1500);
	} else {
		--score;
		return 0;
	}
	console.log(score);
}

function move () {
	if ( move_array.length > 0 ) {
		for ( let i = 0; i < move_array.length; i++ ) {
			//check: it is object? 
			if ( move_array[i][0] !== undefined ) {
				let temp = move_array[i][0];
				//transform to obj
				temp.move = {};
				temp.move.destination = move_array[i][1];
				temp.move.step = move_array[i][2];
				temp.move.way = temp.position.distanceTo(temp.move.destination); 
				move_array[i] = temp;
			} else {
				let temp = move_array[i];
				//check: obj in the end way?
				if ( temp.move.way >= temp.move.step * 2 ) {
					//move obj
					//x
					if ( temp.position.x > temp.move.destination.x ) temp.position.x -= temp.move.step;
					if ( temp.position.x < temp.move.destination.x ) temp.position.x += temp.move.step;
					//y
					if ( temp.position.y > temp.move.destination.y ) temp.position.y -= temp.move.step;
					if ( temp.position.y < temp.move.destination.y ) temp.position.y += temp.move.step;
					//z
					if ( temp.position.z > temp.move.destination.z ) temp.position.z -= temp.move.step;
					if ( temp.position.z < temp.move.destination.z ) temp.position.z += temp.move.step;
					//recount way
					temp.move.way = temp.position.distanceTo(temp.move.destination); 
					move_array[i] = temp;
				} else {
					//delete obj
					move_array.splice( i , i + 1 );
				}
			}
		}
	}
}

