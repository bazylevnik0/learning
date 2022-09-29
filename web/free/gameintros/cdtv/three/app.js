console.log( "app.js" );
import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';
//--------------------------------------------------------------------------------
var loader_obj = new OBJLoader();
var loader_mtl = new MTLLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const directionalLight_f = new THREE.DirectionalLight( 0xffffff, 0.25 );
      directionalLight_f.position.set(0,0,1)
scene.add( directionalLight_f );
const directionalLight_b = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight_b.position.set(0,1,-1)
scene.add( directionalLight_b );


const rectLight = new THREE.RectAreaLight( 0x404040, 1,  5, 5 );
rectLight.position.set( 0, 0, 2 );
rectLight.lookAt( 0, 0, -2 );
scene.add( rectLight )


const light  = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, -33.3 , 0 );
scene.add( light );
const lighta = new THREE.PointLight( 0xffffff, 1, 100 );
lighta.position.set( 0, 33.3 , 0 );
scene.add( lighta );
const lightc = new THREE.PointLight( 0xffffff, 1, 100 );
lightc.position.set( 0, 0 , 2 );
scene.add( lightc );

//textures

//------------------------------------------------------------------------------------------
const texture_back = new THREE.TextureLoader().load( 'back.png' );
const texture_blue = new THREE.TextureLoader().load( 'blue.png' );

const urls_env = [ "back_f_l.png", "back_f_r.png" ,
		   "back_f_l.png", "back_f_r.png" ,
		   "back_f.png", "back_b.png"   ];

const texture_env = new THREE.CubeTextureLoader().load( urls_env );
texture_env.format = THREE.RGBFormat;
texture_env.mapping = THREE.CubeRefractionMapping;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
// Create cube camera
const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
scene.add( cubeCamera );


//---------------------------------------------------------------------------------------------
//objects
//back
const geometry_back = new THREE.BoxGeometry();
const material_back = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var cube_back = new THREE.Mesh( geometry_back, material_back );
    cube_back.material.map = texture_back;
    cube_back.position.z = -2
    cube_back.scale.x = 21
    cube_back.scale.y = 12
    cube_back.scale.z = 0.1
 
scene.add( cube_back );

const material_back_l = new THREE.MeshPhongMaterial( { color: 0xffffff , transparent: true , opacity: 0.4} );
var cube_back_l = new THREE.Mesh( geometry_back, material_back_l );
    cube_back_l.material.map = texture_back;
    cube_back_l.position.x = -10
    cube_back_l.position.z = 0.5
    cube_back_l.scale.x = 15
    cube_back_l.scale.y = 15
    cube_back_l.scale.z = 0.1
    cube_back_l.rotation.y = 2
    cube_back_l.rotation.z = -1.5
  
scene.add( cube_back_l );

const material_back_r = new THREE.MeshPhongMaterial( { color: 0xffffff , transparent: true ,opacity: 0.4 } );
var cube_back_r = new THREE.Mesh( geometry_back, material_back_r );
    cube_back_r.material.map = texture_blue;
    cube_back_r.position.x = 10
    cube_back_r.position.z = 0.5
    cube_back_r.scale.x = 15
    cube_back_r.scale.y = 15
    cube_back_r.scale.z = 0.1
    cube_back_r.rotation.y = -2
    cube_back_r.rotation.z = 1.5


scene.add( cube_back_r );
const material_back_f = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x404040 } );
var cube_back_f = new THREE.Mesh( geometry_back, material_back_f );
     cube_back_f.material.map = texture_back;
    cube_back_f.position.z = 5
    cube_back_f.scale.x = 30
    cube_back_f.scale.y = 30
    cube_back_f.scale.z = 0.1

scene.add( cube_back_f );

  
//text
var text = []
loader_obj.load('text.obj' , (event)=>{loader_foo(event,"1",0)})
loader_obj.load('text.obj' , (event)=>{loader_foo(event,"2",2.1)})
loader_obj.load('text.obj' , (event)=>{loader_foo(event,"3",4.2)})
function loader_foo ( object , prefix ,k) {
	object.name = "text" + prefix;

		object.children[0].material =  new THREE.MeshPhysicalMaterial({
      		transparent: true,
     		opacity: 1,
   		clearcoat: 1,
		metalness: 0.0,
   		reflectivity: 1,
		transmission: 0.3,
		envMap: texture_env,
		emissive: 0x505050
		})

		object.children[1].material = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: cubeRenderTarget.texture, transparent: true ,opacity: 0.6 , reflectivity: 1 } );
		object.children[2].material = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: cubeRenderTarget.texture, transparent: true ,opacity: 0.4 , reflectivity: 1 } );

	object.scale.x = 1.3
	object.scale.y = 1.3
	object.scale.z = 1.3
	object.rotation.y += k
	object.rotation.x  = 0.15
	object.position.x = 1
	object.children.forEach( el => el.position.x = -0.2 )
	object.position.y = 0.65
	text.push(object)
	scene.add(object)
}

//main sprite
var map_main  = new THREE.TextureLoader().load( 'main.png'  );
var material_main  = new THREE.SpriteMaterial( { map: map_main } );
var sprite_main  = new THREE.Sprite( material_main  );
    sprite_main.scale.x = 16
    sprite_main.scale.y = 9    
    sprite_main.position.z = -1.5    
    sprite_main.position.y = -0.5
scene.add(sprite_main)

//laser sprite
//load
var laser = {
	laser_a    : { map: new THREE.TextureLoader().load( 'laser_a.png'   ) } ,
	laser_b    : { map: new THREE.TextureLoader().load( 'laser_b.png'   ) } ,
	laser_eff  : { map: new THREE.TextureLoader().load( 'laser_eff.png' ) } ,
	blick      : { map: new THREE.TextureLoader().load( 'blick.png'     ) } ,
	light_a    : { map: new THREE.TextureLoader().load( 'light_a.png'   ) } ,
	light_b    : { map: new THREE.TextureLoader().load( 'light_b.png'   ) } ,
	light_c    : { map: new THREE.TextureLoader().load( 'light_c.png'   ) } ,
}
for (let value in laser) { laser[value].material = new THREE.SpriteMaterial( { map: laser[value].map } ); }
for (let value in laser) { laser[value].sprite = new THREE.Sprite( laser[value].material  ); }
for (let value in laser) { 
	scene.add(laser[value].sprite) 
	laser[value].sprite.scale.x = 23
   	laser[value].sprite.scale.y = 9
	laser[value].sprite.position.z = -1.4
	laser[value].sprite.position.x = -0.2
}
//animate
console.log("animate")
let laser_blick = setInterval( function () {
	let n = Math.floor(Math.random()*2)
	switch (n) {
		case 0 : {
			laser.laser_a.sprite.visible = false
			laser.laser_b.sprite.visible = true
		} break;
		case 1 : {
			laser.laser_b.sprite.visible = false
			laser.laser_a.sprite.visible = true
		} break;
	}
} , 100)
let light_blick = setInterval( function () {
	let n = Math.floor(Math.random()*3)
	switch (n) {
		case 0 : {
			laser.light_a.sprite.visible = true
			laser.light_b.sprite.visible = false
			laser.light_b.sprite.visible = false
		} break;
		case 1 : {
			laser.light_a.sprite.visible = false
			laser.light_b.sprite.visible = true
			laser.light_b.sprite.visible = false
		} break;
		case 2 : {
			laser.light_a.sprite.visible = false
			laser.light_b.sprite.visible = false
			laser.light_c.sprite.visible = true
		} break;
	}
} , 10)


camera.position.z = 5;
const animate = function () {
	requestAnimationFrame( animate );
	if (text[0] !== undefined ||
	    text[1] !== undefined ||
	    text[2] !== undefined) {
	    text.forEach(el => el.rotation.y -= 0.02)
	    text.forEach(el => el.visible = false)
	    text.forEach(function(el) {
				if (el.rotation.y%(2*Math.PI) < - 1.5) {
				        el.children[0].material.emissive.set(0x2ff7ea)
					el.children[0].material.color.set(0xffffff)
				} else  el.children[0].material.color.set(0x57bade)
			})

cubeCamera.position.set(0,0,0)
cubeCamera.update( renderer, scene );
		    text.forEach(el => el.visible = true)

renderer.render( scene, camera );


	}



};

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
