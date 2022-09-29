console.log( "app.js" );
import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

import * as Tone from "https://cdn.skypack.dev/tone"

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

      scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

//load sprite
const map_sprite_1 = new THREE.TextureLoader().load( 'logo_1.png' );
const material_sprite_1 = new THREE.SpriteMaterial( { map: map_sprite_1 } );

const map_sprite_2 = new THREE.TextureLoader().load( 'logo_2.png' );
const material_sprite_2 = new THREE.SpriteMaterial( { map: map_sprite_2 } );

const map_sprite_3 = new THREE.TextureLoader().load( 'logo_3.png' );
const material_sprite_3 = new THREE.SpriteMaterial( { map: map_sprite_3 } );

const map_sprite_4 = new THREE.TextureLoader().load( 'logo_4.png' );
const material_sprite_4 = new THREE.SpriteMaterial( { map: map_sprite_4 } )

const map_sprite_text = new THREE.TextureLoader().load( 'logo_text.png' );
const material_sprite_text = new THREE.SpriteMaterial( { map: map_sprite_text } );

var logo_sprite_1 = new THREE.Sprite( material_sprite_1 );
    logo_sprite_1.scale.x = 9
    logo_sprite_1.scale.y = 5.5
    logo_sprite_1.position.z = 0.08
    logo_sprite_1.position.x = -1.2

var logo_sprite_2 = new THREE.Sprite( material_sprite_2 );
    logo_sprite_2.scale.x = 9
    logo_sprite_2.scale.y = 5.5
    logo_sprite_2.position.z = 0.06    
    logo_sprite_2.position.x = -1.2

var logo_sprite_3 = new THREE.Sprite( material_sprite_3 );
    logo_sprite_3.scale.x = 9
    logo_sprite_3.scale.y = 5.5
    logo_sprite_3.position.z = 0.04
    logo_sprite_3.position.x = -1.2

var logo_sprite_4 = new THREE.Sprite( material_sprite_4 );
    logo_sprite_4.scale.x = 9
    logo_sprite_4.scale.y = 5.5
    logo_sprite_4.position.z = 0.02
    logo_sprite_4.position.x = -1.2

var logo_sprite_text = new THREE.Sprite( material_sprite_text );
    logo_sprite_text.scale.x = 9
    logo_sprite_text.scale.y = 5.5


scene.add( logo_sprite_1 );
scene.add( logo_sprite_2 );
scene.add( logo_sprite_3 );
scene.add( logo_sprite_4 );
scene.add( logo_sprite_text );

//load black boxes for animation
const geometry_box = new THREE.BoxGeometry();
const material_box = new THREE.MeshBasicMaterial( { color: 0x000000 } );

var box_1 = new THREE.Mesh( geometry_box , material_box );
    box_1.scale   .set( 1.25 , 1.6  , 0    )
    box_1.position.set(-2.9  , 1.75 , 0.09 )

var box_2 = new THREE.Mesh( geometry_box , material_box );
    box_2.scale   .set( 1.25   , 1.6  , 0    )
    box_2.position.set(-1.675  , 1.75 , 0.07 ) 

var box_3 = new THREE.Mesh( geometry_box , material_box );
    box_3.scale   .set( 1.25 , 1.6  , 0    )
    box_3.position.set( -0.45  , 1.75 , 0.05 )

var box_4 = new THREE.Mesh( geometry_box , material_box );
    box_4.scale   .set( 1.2   , 1.6  , 0    )
    box_4.position.set( 0.675  , 1.75 , 0.03 ) 
 
var box_text = new THREE.Mesh( geometry_box , material_box );
    box_text.scale   .set( 10 ,  3    , 0    )
    box_text.position.set( 0  , -0.75 , 0.01 ) 
 
scene.add( box_1 );
scene.add( box_2 );
scene.add( box_3 );
scene.add( box_4 );
scene.add( box_text );

let step = false
const animate = function () {
	requestAnimationFrame( animate );

	step ? show_logo() : false

	renderer.render( scene, camera );
};

function show_logo () {
	logo_sprite_1.position.x += 0.025
	logo_sprite_2.position.x += 0.025	
	logo_sprite_3.position.x += 0.025	
	logo_sprite_4.position.x += 0.025
	
	if(logo_sprite_1.position.x > 0.2) {
		 step = false; 
		 setTimeout( function () {
			box_text.scale.set(0,0,0)
		 	},800)
	}
}

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animationStart() { step = true; }
