console.log( "app.js" );
var devmode = 0;

import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

import * as Tone from "https://cdn.skypack.dev/tone"

var camera = new THREE.PerspectiveCamera( 75 , window.innerWidth / window.innerHeight , 0.1 , 1000 );
    camera.position.set( 0 , 0 , 1.25 );

const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth , window.innerHeight );

document.body.appendChild( renderer.domElement );

var loader_game           = new OBJLoader();
var loader_nav            = new OBJLoader();
var loader_intro          = new OBJLoader();
var loader_material_game  = new MTLLoader();
var loader_material_nav   = new MTLLoader();
var loader_material_intro = new MTLLoader();
var loader_texture        = new THREE.TextureLoader();
var loader_font           = new THREE.FontLoader();

//global
var temp;

var process;
var level = "jr";
var score = 0;

var gameobject;
var move_array = [];

var light = new THREE.PointLight( 0xffffff , 1 , 25 );
    light.position.set( 0 , -3 , 3 );
var light_ambient = new THREE.AmbientLight( 0x404040 );

	//add scenes
	var scene_intro = new THREE.Scene();
    		scene_intro.name = "scene_intro";
	var scene_game  = new THREE.Scene();
    		scene_game.name  = "scene_game";
	var scene_nav   = new THREE.Scene();
    		scene_nav.name   = "scene_nav";

	//add groups templates
	var temp_group = new THREE.Group();
    		//lights
    		scene_intro.add( set_name( temp_group.clone() , "lights" ) );
    		scene_game .add( set_name( temp_group.clone() , "lights" ) );
    		scene_nav  .add( set_name( temp_group.clone() , "lights" ) );
 		//objects
    		scene_intro.add( set_name( temp_group.clone() , "objects" ) );
    		scene_game .add( set_name( temp_group.clone() , "objects" ) );
    		scene_nav  .add( set_name( temp_group.clone() , "objects" ) );
		//sprites
		scene_intro.add( set_name( temp_group.clone() , "sprites" ) );
    		scene_game .add( set_name( temp_group.clone() , "sprites" ) );
    		scene_nav  .add( set_name( temp_group.clone() , "sprites" ) );
		//textures
		scene_intro.add( set_name( temp_group.clone() , "textures" ) );
    		scene_game .add( set_name( temp_group.clone() , "textures" ) );
    		scene_nav  .add( set_name( temp_group.clone() , "textures" ) );
		//temp
		scene_intro.add( set_name( temp_group.clone() , "temp" ) );
    		scene_game .add( set_name( temp_group.clone() , "temp" ) );
    		scene_nav  .add( set_name( temp_group.clone() , "temp" ) );

	//add scene id childrens to name grid
	add_gridGroups( scene_intro );
	add_gridGroups( scene_game );
	add_gridGroups( scene_nav );


//scene_intro
scene_intro.lights.add( light.clone() );
scene_intro.lights.add( light_ambient.clone() );

add_sprite_object( "./src/scene_intro/sprites/back.png" 		        , "back" 			 , scene_intro , 1 , false );
add_sprite_object( "./src/scene_intro/sprites/person_close_hand_open_eyes.png"  , "person_close_hand_open_eyes"  , scene_intro , 2 , false );
add_sprite_object( "./src/scene_intro/sprites/person_open_hand_open_eyes.png"   , "person_open_hand_open_eyes"   , scene_intro , 2 , false );
add_sprite_object( "./src/scene_intro/sprites/person_open_hand_close_eyes.png"  , "person_open_hand_close_eyes"  , scene_intro , 2 , false );
add_sprite_object( "./src/scene_intro/sprites/shirma.png" 		        , "shirma" 			 , scene_intro , 3 , false );
add_sprite_object( "./src/scene_intro/sprites/start.png" 			, "start" 			 , scene_intro , 9 , false );
add_sprite_object( "./src/scene_intro/sprites/logo.png" 			, "logo" 			 , scene_intro , 6 , false );
add_sprite_object( "./src/scene_intro/sprites/redcircle.png" 			, "redcircle" 			 , scene_intro , 3 , false );
add_sprite_object( "./src/scene_intro/sprites/bluecircle.png" 			, "bluecircle" 			 , scene_intro , 3 , false );
add_sprite_object( "./src/scene_intro/sprites/greencircle.png" 			, "greencircle" 		 , scene_intro , 3 , false );

add_gridNames( scene_intro.sprites );
scene_intro_set_start_position();

	//sounds
	var scene_intro_sound_back   = new Tone.Player("./src/scene_intro/sounds/intro.mp3") .toDestination();
	var scene_intro_sound_effect = new Tone.Player("./src/scene_intro/sounds/effect.wav").toDestination();
	var scene_intro_sound_fire   = new Tone.Player("./src/scene_intro/sounds/fire.wav")  .toDestination();

	//scene_intro functions
	function scene_intro_set_start_position ( ) {
		 scene_intro.sprites.back.scale.set( 3.5 , 2.225 , );
		 scene_intro.sprites.person_close_hand_open_eyes.scale.set( 3 , 1.5 , );
		 scene_intro.sprites.person_close_hand_open_eyes.position.set( 0.75 , 0 , );
		 scene_intro.sprites.shirma.scale.set( 1.5, 2 , );
		 scene_intro.sprites.shirma.position.set( 0.75, 0 , );
		 scene_intro.sprites.redcircle.scale.set( 3 , 2 )
		 scene_intro.sprites.bluecircle.scale.set( 3 , 2 )
		 scene_intro.sprites.greencircle.scale.set( 3 , 2 )
		 scene_intro.sprites.logo.scale.set( 2.25 , 1.75 , );
		 scene_intro.sprites.logo.position.set( 0 , -0.25, 0.20 );
		 scene_intro.sprites.person_open_hand_open_eyes.scale.set( 0 , 0 ,  );
		 scene_intro.sprites.person_open_hand_open_eyes.position.set( 0 , 0 , 0.20 );
		 scene_intro.sprites.person_open_hand_close_eyes.scale.set( 0 , 0 ,  );
		 scene_intro.sprites.person_open_hand_close_eyes.position.set( 0 , 0 , 0.20 );
		 scene_intro.sprites.start.scale.set( 0 , 0 , )
		 scene_intro.sprites.start.position.set( 0 , 0 , 0.4 )
	}
	function scene_intro_show ( ) {
		 process = "intro";
		 scene_intro_sound_effect.start();
		 move_array.push( [scene_intro.sprites.person_close_hand_open_eyes, new THREE.Vector3( -0.75 , 0 ,  ) , 0.01] );
		 {
		  let wait0 = setInterval( function () { 
		  	if ( move_array.length < 1 ) { 
				clearInterval( wait0 );
	   			scene_intro.sprites.person_close_hand_open_eyes.position.set( -0.75 , 0 , 0.15 );
	 			move_array.push( [scene_intro.sprites.person_close_hand_open_eyes, new THREE.Vector3( 0 , 0 , 0.20 ) , 0.01] );
				let wait1 = setInterval( function () { 
					if ( move_array.length < 1 ) {
						clearInterval( wait1 );
						move_array.push( [scene_intro.sprites.redcircle , new THREE.Vector3( -1 , 0 , ) , 0.02] )
						move_array.push( [scene_intro.sprites.bluecircle , new THREE.Vector3(  1 , 0 , ) , 0.02] ); 
						move_array.push( [scene_intro.sprites.logo , new THREE.Vector3( 0 , 0.25 , 0.20 ) , 0.01] );
						let wait2 = setInterval( function () {
						        if ( move_array.length < 1 ) {
								 clearInterval( wait2 );
								 scene_intro.sprites.person_close_hand_open_eyes.scale.set( 0 , 0 , );
			 					 scene_intro.sprites.person_open_hand_open_eyes.scale.set( 3 , 1.5 , ); 
								 scene_intro.sprites.person_open_hand_open_eyes.position.set( 0 , 0 , 0.20 );
								 setTimeout( function () {
											     scene_intro.sprites.person_open_hand_open_eyes.scale.set( 0 , 0 , );
			 								     scene_intro.sprites.person_open_hand_close_eyes.scale.set( 3 , 1.5 , );
											 } , 500 );
								 setTimeout( function () {
											     scene_intro_sound_back.loop = true;
											     scene_intro_sound_back.start();
											     scene_intro.sprites.person_open_hand_close_eyes.scale.set( 0 , 0 , );
			 								     scene_intro.sprites.person_open_hand_open_eyes.scale.set( 3 , 1.5 , ); 
	    								     		     scene_intro.sprites.start.scale.set( 0.5 , 0.15 , )
											     let count = true;
											     let wait_start = setInterval( function () {
																	 switch ( count ) {
																		case true  : {
																			scene_intro.sprites.start.scale.set( 0 , 0 , )
											   								count = !count;
																		} break;
																		case false : {
																			scene_intro.sprites.start.scale.set( 0.5 , 0.15 , )
											   								count = !count;
																		} break;
																	 }
																	 if (process == "game") {
											 						     scene_intro_sound_back.loop = false;
																	     scene_intro_sound_back.stop();
																	     clearInterval( wait_start );
																	 }
																       } , 300 );
											 } , 1000 );
									       	     }
										     } , 100 );
								     }
								     } , 100 );
						       }
						 } , 100 );
		 }
	}

//scene_game
scene_game.lights.add( light.clone() );
scene_game.lights.add( light_ambient.clone() );
loader_material_game.load( './src/scene_game/scene_game(out).mtl' , function( material ) {
						     	material.preload();
						     	loader_game.setMaterials( material );
						     	loader_game.load('./src/scene_game/scene_game(out).obj' , ( object ) => {
													object.name = "stage";
													object.position.z = -1.25;
													object.rotation.set( 1.575 , 0 , 0 );
														//clearing names
														for ( let i = 0 ; i < object.children.length ; i++ ) {
															if ( (object.children[i].name[object.children[i].name.length - 1] >= "0") &&  (object.children[i].name[object.children[i].name.length - 1] <= "9") ) { 
															      object.children[i].name = object.children[i].name.substring(0, object.children[i].name.length - 4);
															}
														}
													scene_game.objects.add( object );
													add_gridNames ( scene_game.objects );
													add_gridNames ( scene_game.objects.stage );
												}
					       			   );
				     			}
		    );
	//score
	loader_font.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
		let local_text = "score: " + score + " !";
		let local_geometry = new THREE.TextGeometry( local_text , {
    			font: font,
    			size: 3,
    			height: 0.2,
    			curveSegments: 12,
    			bevelEnabled: false
  		});
		let local_material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
 		let local_mesh = new THREE.Mesh( local_geometry, local_material );
		    local_mesh.position.set( -0.4 , 0.7 , 0 );
		    local_mesh.scale.set( 0.05 , 0.05 , 0.05 );
		    local_mesh.name = "score";
		    local_mesh.visible = false;
		    scene_game.temp.add( local_mesh );
	            add_gridNames ( scene_game.temp );
	});

	//portals
	var portals_texture_array = [
	  		   	     loader_texture.load( "./src/scene_game/textures/whitenoise/w0.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w1.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w2.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w3.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w4.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w5.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w6.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w7.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w8.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w9.png"  ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w10.png" ),
				     loader_texture.load( "./src/scene_game/textures/whitenoise/w11.png" )
				    ];
	var portals_material_array = [];
	var portals_sprite_array   = [];
	for ( let i = 0 ; i < 12 ; i++ ) {
		portals_material_array.push( new THREE.SpriteMaterial( { map: portals_texture_array[i] , color: 0xffffff, fog: true  , transparent: false , blending: THREE.AdditiveBlending }) );
		let x = new THREE.Sprite( portals_material_array[i] );
	    	    x.scale.set( 1.25 , 1.25 , 1.25 );
		portals_sprite_array.push( [ x.clone() , x.clone() ] );
		portals_sprite_array[i][0].position.set( -1.5 , -0.25 , -1.30 );
		portals_sprite_array[i][1].position.set(  1.5 , -0.25 , -1.30 );
	}

	//sounds
	var scene_game_sound_back   = new Tone.Player("./src/scene_game/sounds/game.mp3").toDestination();
	var scene_game_sound_hiphop = new Tone.Player("./src/scene_game/sounds/hiphop.mp3").toDestination();
	var scene_game_sound_true   = new Tone.Player("./src/scene_game/sounds/true.mp3")  .toDestination();
	var scene_game_sound_false  = new Tone.Player("./src/scene_game/sounds/false.mp3") .toDestination();
	
		//scene_game functions
		let intervals = [];
		let step = 0;
		var reverse = false;
		let loop_change_objects , loop_change_portals;
		function scene_game_prepare () {
			if ( level == "jr" ) {
				clearInterval( loop_change_objects );
				clearInterval( loop_change_portals );				
				scene_game_prepare_set();
			}
			if ( level == "mid" ) {
				clearInterval( loop_change_objects );
				clearInterval( loop_change_portals );
				scene_game_prepare_set();
			
				loop_change_objects = setInterval( function () {	
											level !== "mid" ? clearInterval( loop_change_objects ): 0 ;
											switch ( gameobject.form ) {
												 case "square" :  scene_game_prepare_set_gameobject ( "round" ) ; break;
												 case "round"  :  scene_game_prepare_set_gameobject ( "square" ); break; }} , 2000 );		
			}
			if ( level == "sr" ) {
				clearInterval( loop_change_objects );
				clearInterval( loop_change_portals );
				scene_game_prepare_set();
		
				loop_change_objects =  setInterval( function () {				
											level !== "sr" ? clearInterval( loop_change_objects ): 0 ;
											switch ( gameobject.form ) {
												 case "square" :  scene_game_prepare_set_gameobject ( "round" ) ; break;
												 case "round"  :  scene_game_prepare_set_gameobject ( "square" ); break; }} , 1000 );
				loop_change_portals =  setInterval( function () {	
											level !== "sr" ? clearInterval( loop_change_portals ): 0 ;
											if ( (step % 2) == 0) {
													reverse = true;
								   					scene_game.objects.stage.portalround_Cube                  .position.z  = 0.42;
								   					scene_game.objects.stage.portalsquare_Cube                 .position.z  = 0.42;
													scene_game.objects.stage.portalroundback_Plane             .position.z  = 0.42;
								   					scene_game.objects.stage.portalsquareback_Plane            .position.z  = 0.42;
													scene_game.objects.stage.portalroundback_Plane .children[1].position.x =  0.55;
													scene_game.objects.stage.portalsquareback_Plane.children[1].position.x = -0.55;
												} else {
													reverse = false;
								   					scene_game.objects.stage.portalround_Cube                  .position.z  = 0;
								   					scene_game.objects.stage.portalsquare_Cube                 .position.z  = 0;
													scene_game.objects.stage.portalroundback_Plane             .position.z  = 0;
								   					scene_game.objects.stage.portalsquareback_Plane            .position.z  = 0;
													scene_game.objects.stage.portalroundback_Plane .children[1].position.x = -0.55;
													scene_game.objects.stage.portalsquareback_Plane.children[1].position.x =  0.55;
												}
												step++;
													scene_game.objects.stage.portalround_Cube      .rotation.y  += +Math.PI;
													scene_game.objects.stage.portalsquare_Cube     .rotation.y  -= -Math.PI;
													scene_game.objects.stage.portalroundback_Plane .rotation.y  += +Math.PI;
													scene_game.objects.stage.portalsquareback_Plane.rotation.y  -= -Math.PI;
																						}, 2000 );

				if ( (step % 2) == 0) {
						 step = 0;
				} else   step = 1;
				
			}
			function scene_game_prepare_set () {
				for (let i = 0; i < intervals.length; i++) {
					clearInterval( intervals[i] );
					intervals = [];
				}
				move_array = [];
				scene_game.objects.stage.round_Sphere.position.set ( 0 , 0 , 0 );
				scene_game.objects.stage.square_Cube .position.set ( 0 , 0 , 0 );
				let local_gameobjects_array = [ scene_game.objects.stage.round_Sphere , scene_game.objects.stage.square_Cube ];
				gameobject = local_gameobjects_array[ Math.round( Math.random( 1 ) ) ];
				gameobject.position.set( 0 , 0 , 0.5 );
				if ( gameobject.form == "round" )  { scene_game.objects.stage.square_Cube.visible  = false; }
				if ( gameobject.form == "square" ) { scene_game.objects.stage.round_Sphere.visible = false; }
				gameobject.visible = true;
			}
		}

		function scene_game_prepare_set_gameobject ( temp_form ) {
			scene_game.objects.stage.round_Sphere.position.set ( 0 , 0 , 0 );
			scene_game.objects.stage.square_Cube .position.set ( 0 , 0 , 0 );
			if ( temp_form == "square"  ) { gameobject = scene_game.objects.stage.square_Cube;  scene_game.objects.stage.round_Sphere.visible = false; }
			if ( temp_form == "round" )   { gameobject = scene_game.objects.stage.round_Sphere; scene_game.objects.stage.square_Cube .visible = false; }
			gameobject.position.set( 0 , 0 , 0.5 );
			gameobject.visible = true;
		}


		function scene_game_choice ( temp_select ) {
			if ( temp_select.form == gameobject.form ) {
				 scene_game_sound_true.start();
				 switch ( level ) {
					case "jr"  : score += 1; break;
					case "mid" : score += 2; break;
					case "sr"  : score += 3; break;
				 }

				 //effect 
				 scene_game.objects.stage.lefttop_Plane    .position.set( 0 , 0 ,  0.5 );
				 move_array.push( [ scene_game.objects.stage.lefttop_Plane     , new THREE.Vector3( 0 , 0 , 0 ) , 0.01 ] );
				 scene_game.objects.stage.righttop_Plane   .position.set( 0 , 0 ,  0.5 );
				 move_array.push( [ scene_game.objects.stage.righttop_Plane    , new THREE.Vector3( 0 , 0 , 0 ) , 0.01 ] );
				 scene_game.objects.stage.leftbottom_Plane .position.set( 0 , 0 , -0.5 );
				 move_array.push( [ scene_game.objects.stage.leftbottom_Plane  , new THREE.Vector3( 0 , 0 , 0 ) , 0.01 ] );
				 scene_game.objects.stage.rightbottom_Plane.position.set( 0 , 0 , -0.5 );
				 move_array.push( [ scene_game.objects.stage.rightbottom_Plane , new THREE.Vector3( 0 , 0 , 0 ) , 0.01 ] );
 
				 switch ( reverse ) {
					case true : {
						 if ( gameobject.form == "square" ) { 
				      		      gameobject.position.x = -1.5;
						      gameobject.position.y = 0.5;;
						      gameobject.position.z = 1;
						      move_array.push ( [gameobject , new THREE.Vector3( -1.5 , -0.75 , 1.5 ) , 0.1 ] );
				 		 }
				 		 if ( gameobject.form == "round"  ) { 
				      		      gameobject.position.x = 1.5;
						      gameobject.position.y = 0.5;
						      gameobject.position.z = 1;
						      move_array.push ( [gameobject , new THREE.Vector3( 1.5 , -0.75 , 1.5 ) , 0.1 ] );
				 		 }
					} break;
					case false: {
						if ( gameobject.form == "square" ) { 
				      		      gameobject.position.x = 1.5;
						      gameobject.position.y = 0.5;
						      gameobject.position.z = 1;
						      move_array.push ( [gameobject , new THREE.Vector3( 1.5 , -0.75 , 1.5 ) , 0.1 ] );
				 		}
				 		if ( gameobject.form == "round"  ) { 
				      		      gameobject.position.x = -1.5;
						      gameobject.position.y = 0.5;
						      gameobject.position.z = 1;
						      move_array.push ( [gameobject , new THREE.Vector3( -1.5 , -0.75 , 1.5 ) , 0.1 ] );
				 		}
					}
				 }
				 setTimeout ( scene_game_prepare , 1500 );
			} else   {
				  scene_game_sound_false.start();
				  switch ( level ) {
					case "jr"  : score -= 1; break;
					case "mid" : score -= 2; break;
					case "sr"  : score -= 3; break;
				 }
				 score < 0 ? score = 0 : score = score;
			}
		}

		function scene_game_showscore () {
			loader_font.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
				let local_text = "score: " + score + " !"; 
				let local_geometry = new THREE.TextGeometry( local_text , {
    					font: font,
    					size: 3,
    					height: 0.2,
    					curveSegments: 12,
    					bevelEnabled: false
  				});
				let local_material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
 				let local_mesh = new THREE.Mesh( local_geometry, local_material );
		 		local_mesh.position.set( -0.4 , 0.7 , 0 );
		    		local_mesh.scale.set( 0.05 , 0.05 , 0.05 );
		   		local_mesh.name = "score";
			    	local_mesh.visible = true;
			    	scene_game.children[4].children[0] = local_mesh;
			});
			setTimeout( function () { scene_game.children[4].children[0].visible = false; }, 1500);
		 }

//scene_nav
scene_nav.lights.add( light.clone() );
scene_nav.lights.add( light_ambient.clone() );
loader_material_nav.load('./src/scene_nav/scene_nav.mtl', function( material ) {
						     	material.preload();
						     	loader_nav.setMaterials( material );
						     	loader_nav.load('./src/scene_nav/scene_nav.obj', (object) => {
													  object.name = "room";
													  object.position.z = -3;
													  object.position.y = 0.8;
													  object.rotation.set(2,0,0);
													  scene_nav.objects.add(object);
						     						}
						       		   );
					     		}
			    );															
add_sprite_object( "./src/scene_nav/sprites/level.png"        , "level" 	   , scene_nav , 0 , false ); //0
add_sprite_object( "./src/scene_nav/sprites/jr.png"           , "jr" 	           , scene_nav , 0 , false ); //1
add_sprite_object( "./src/scene_nav/sprites/checkbox-on.png"  , "checkbox_on_jr"   , scene_nav , 0 , false ); //2
add_sprite_object( "./src/scene_nav/sprites/checkbox-off.png" , "checkbox_off_jr"  , scene_nav , 0 , false ); //3
add_sprite_object( "./src/scene_nav/sprites/mid.png"	      , "mid" 	           , scene_nav , 0 , false ); //4
add_sprite_object( "./src/scene_nav/sprites/checkbox-on.png"  , "checkbox_on_mid"  , scene_nav , 0 , false ); //5
add_sprite_object( "./src/scene_nav/sprites/checkbox-off.png" , "checkbox_off_mid" , scene_nav , 0 , false ); //6
add_sprite_object( "./src/scene_nav/sprites/sr.png"	      , "sr" 	           , scene_nav , 0 , false ); //7
add_sprite_object( "./src/scene_nav/sprites/checkbox-on.png"  , "checkbox_on_sr"   , scene_nav , 0 , false ); //8
add_sprite_object( "./src/scene_nav/sprites/checkbox-off.png" , "checkbox_off_sr"  , scene_nav , 0 , false ); //9
add_sprite_object( "./src/scene_nav/sprites/up.png"           , "upl"              , scene_nav , 0 , false ); //10
add_sprite_object( "./src/scene_nav/sprites/up.png"           , "upr"              , scene_nav , 0 , false ); //11

add_gridNames( scene_nav.sprites );

scene_nav.sprites.level.scale   .set( 0.5 , 0.25 , 0.25 );

scene_nav.sprites.level.position.set( 0,    -0.2  , 0    );

for ( let i = 1; i < 10; i++ ) {
	scene_nav.sprites.children[i].scale.set( 0.1 , 0.1 , 0.1 );
}

scene_nav.sprites.jr		  .position.set( -0.5 ,  -0.4 , 0 );
scene_nav.sprites.checkbox_on_jr  .position.set( -0.5 , -0.7 , 0 );
scene_nav.sprites.checkbox_off_jr .position.set( -0.5 , -0.7 , 0 );
scene_nav.sprites.mid		  .position.set(  0   ,  -0.4 , 0 );
scene_nav.sprites.checkbox_on_mid .position.set(  0   , -0.7 , 0 );
scene_nav.sprites.checkbox_off_mid.position.set(  0   , -0.7 , 0 );
scene_nav.sprites.sr		  .position.set(  0.5 ,  -0.4 , 0 );
scene_nav.sprites.checkbox_on_sr  .position.set(  0.5 , -0.7 , 0 );
scene_nav.sprites.checkbox_off_sr .position.set(  0.5 , -0.7 , 0 );
scene_nav.sprites.upl             .position.set( -0.75 , 0.3 , 0 );
scene_nav.sprites.upr             .position.set(  0.75 , 0.3 , 0 );

//sounds
var scene_nav_sound_back  = new Tone.Player("./src/scene_nav/sounds/nav.mp3") .toDestination();
var scene_nav_sound_fire  = new Tone.Player("./src/scene_nav/sounds/fire.wav").toDestination();

//postprocessing
var bloomPass = new BloomPass(
	0.75, // strength
	25,   // kernel size
    	4,    // sigma ?
    	256,  // blur render target resolution
);

var filmPass = new FilmPass(
   	0.125, // noise intensity
    	0.025, // scanline intensity
    	648,   // scanline count
    	false, // grayscale
);
filmPass.renderToScreen = true;

const composer_game  = new EffectComposer(renderer);
const composer_intro = new EffectComposer(renderer);
const composer_nav   = new EffectComposer(renderer);
					  renderer.autoClear = false;

var change_sound = new Tone.Player("./src/change.wav").toDestination();

//preloading
let check_loading_view = false;
let loading_view = setInterval( function () {
	if (scene_game.objects.children[0] !== undefined ) {
		clearInterval(loading_view);
		check_loading_view = true;
		//scene_game
		scene_game.objects.stage.leftbottom_Plane.material.transparent  = true;
		scene_game.objects.stage.leftbottom_Plane.material.opacity  = 0.34;
		scene_game.objects.stage.lefttop_Plane.material.transparent     = true;
		scene_game.objects.stage.lefttop_Plane.material.opacity     = 0.34;
		scene_game.objects.stage.rightbottom_Plane.material.transparent = true;
		scene_game.objects.stage.rightbottom_Plane.material.opacity = 0.34;
		scene_game.objects.stage.righttop_Plane.material.transparent    = true;
		scene_game.objects.stage.righttop_Plane.material.opacity    = 0.34;

		scene_game.objects.stage.stoneleftbottom_Plane .material.color.set( 0xDC7633 );
		scene_game.objects.stage.stonerightbottom_Plane.material.color.set( 0xDC7633 );

		composer_game.addPass( new RenderPass( scene_game, camera ) );
		composer_game.addPass( bloomPass );
		composer_game.addPass( filmPass );

		scene_game.objects.stage.portalroundback_Plane.form  = "round";	
		scene_game.objects.stage.portalsquareback_Plane.form = "square";
		scene_game.objects.stage.round_Sphere.form           = "round";
		scene_game.objects.stage.square_Cube.form            = "square";

		add_click_space ( scene_game.objects.stage.portalroundback_Plane   , 0.8 , 0.66 , -0.55 , -0.05  , "round");
		add_click_space ( scene_game.objects.stage.portalsquareback_Plane  , 0.8 , 0.66 ,  0.55 , -0.05  , "square");
		add_click_space ( scene_game.objects.stage.lefttop_Plane           , 3   , 0.66 , 0     , 0.625  , "top" );	
		add_click_space ( scene_game.objects.stage.leftbottom_Plane        , 3   , 0.66 , 0     , -0.725 , "bottom" );	
		
		
		let glow = loader_texture.load( "./src/glow.png" )
		{
			let local_materialA = new THREE.SpriteMaterial( { map: glow, color: 0xffc0cb, fog: true  , transparent: true , blending: THREE.AdditiveBlending , opacity: 0.5 } ); 
			let local_spriteA =  new THREE.Sprite( local_materialA );
		    	    local_spriteA.scale.set( 3 , 6 , 3 )
			let local_materialB = new THREE.SpriteMaterial( { map: glow, color: 0xffc0cb, fog: true  , transparent: true , blending: THREE.AdditiveBlending , opacity: 0.5 } ); 
			let local_spriteB =  new THREE.Sprite( local_materialB );
		    	    local_spriteB.scale.set( 3 , 6 , 3 )	
			scene_game.objects.stage.round_Sphere.add( local_spriteA );
			scene_game.objects.stage.square_Cube.add( local_spriteB );
		}
		scene_game_prepare();

		//scene_intro
		composer_intro.addPass( new RenderPass( scene_intro, camera ) );
		add_click_space( scene_intro.sprites.start  , 3.25 , 2.5 , 0 , 0 , "start" );   
		//scene_nav
		composer_nav.addPass( new RenderPass( scene_nav, camera ) );
		scene_nav.sprites.checkbox_on_jr.position.z = 0.05;
			
		add_click_space ( scene_nav.sprites.jr  , 0.5 , 0.5 , -0.5 , -0.5 , "jr" );	
		add_click_space ( scene_nav.sprites.mid , 0.5 , 0.5 ,  0.0 , -0.5 , "mid" );	
		add_click_space ( scene_nav.sprites.sr  , 0.5 , 0.5 ,  0.5 , -0.5 , "sr" );	
		add_click_space ( scene_nav.sprites.upl , 2   , 1   ,  0   , 0.4  , "return" );	
	
	}
} , 100 );

let check_loading_sound = false;
let loading_sound = setInterval( function () {
	
	if ( scene_intro_sound_back  .loaded &&
	     scene_intro_sound_effect.loaded &&
	     scene_intro_sound_fire  .loaded &&
	     scene_game_sound_back   .loaded &&
	     scene_game_sound_hiphop .loaded &&
	     scene_game_sound_true   .loaded &&
	     scene_game_sound_false  .loaded &&
	     scene_nav_sound_back    .loaded &&
	     scene_nav_sound_fire    .loaded  &&
	     change_sound 	     .loaded  ) {
							check_loading_sound = true;
							clearInterval( loading_sound );
						  }
} , 100 )

if (devmode) {
        let all = setInterval( function () {
			if ( check_loading_view && check_loading_sound ) {
			let temp_object = document.getElementById("box");
			    temp_object.style.position = "absolute";
			    temp_object.style.zIndex = "-1";
			    animate();
			    clearInterval(all);
			    process = "game";
			}
		   } , 100 );

} else setTimeout( loading ,500);

function loading () {
	 let all = setInterval( function () {
			if ( check_loading_view && check_loading_sound ) {
			let temp_object = document.getElementById("box");
			    temp_object.style.position = "absolute";
			    temp_object.style.zIndex = "-1";
			    animate();
			    scene_intro_show();
			    clearInterval(all);
			}
		   } , 100 );
}

console.log( composer_game , filmPass );
//animate
let count = 0;
const animate = function () {
	requestAnimationFrame( animate );
	if (gameobject) gameobject.rotation.z += 0.01;	
	move();

	//general
	switch ( process ) {
		case 'intro' : { composer_intro.render(); } break;
		case 'game'  : { composer_game.render();  } break;
		case 'nav'   : { composer_nav.render();   } break;
	}

	//scene_game
		//update portal materials
		if ( scene_game.objects.stage !== undefined ) {												//замени left right на square round!!!
			 scene_game.objects.stage.portalroundback_Plane .children[0] = portals_sprite_array[count][0];
			 scene_game.objects.stage.portalsquareback_Plane.children[0] = portals_sprite_array[count][1];
			 count++; if (count == 12) count = 0;
		}
		//water
		scene_game.objects.stage.water_Circle.position.y > 0.1   ? scene_game.objects.stage.water_Circle.position.y = 0 :  scene_game.objects.stage.water_Circle.position.y += 0.001;
		scene_game.objects.stage.water4_Cube .position.y > 0.1   ? scene_game.objects.stage.water4_Cube .position.y = 0 :  scene_game.objects.stage.water4_Cube .position.y += 0.00075;
		scene_game.objects.stage.water3_Cube .position.y > 0.075 ? scene_game.objects.stage.water3_Cube .position.y = 0 :  scene_game.objects.stage.water3_Cube .position.y += 0.0005;
		scene_game.objects.stage.water2_Cube .position.y > 0.05  ? scene_game.objects.stage.water2_Cube .position.y = 0 :  scene_game.objects.stage.water2_Cube .position.y += 0.00025;
		scene_game.objects.stage.water1_Cube .position.y > 0.025 ? scene_game.objects.stage.water1_Cube .position.y = 0 :  scene_game.objects.stage.water1_Cube .position.y += 0.00005;

};


//soundloop
let check_scene_game_sound_hiphop = false;
let check_scene_game_sound_back = false;
let check_scene_nav_sound_back    = false;
const soundloop = setInterval( function () {
					if ( process == "game" ) {
						if ( check_scene_game_sound_hiphop == false ) {
						           scene_game_sound_hiphop.loop  = true;
						     check_scene_game_sound_hiphop = true;
						     	   scene_game_sound_hiphop.start();
						} 
						if ( check_scene_game_sound_back == false ) {
						           scene_game_sound_back.loop  = true;
						     check_scene_game_sound_back = true;
						     	   scene_game_sound_back.start();
						} 
					} else {
					   check_scene_game_sound_hiphop = false;
					         scene_game_sound_hiphop.stop();
					   check_scene_game_sound_back = false;
					         scene_game_sound_back.stop();
					}		
					
					if ( process == "nav" ) {
						if ( check_scene_nav_sound_back == false ) {
						           scene_nav_sound_back.loop  = true;
						     check_scene_nav_sound_back = true;
						     	   scene_nav_sound_back.start();
						} 
					} else {
					   check_scene_nav_sound_back = false;
					         scene_nav_sound_back.stop();
					}
			    } ,  50 );

//functions
document.addEventListener('keydown', function(event) {
					switch ( event.keyCode ) {
						case 81 :  change_scene(process, "intro"); process = "intro"; break;
						case 87 :  change_scene(process, "game");  process = "game";  break;
						case 69 :  change_scene(process, "nav");   process = "nav";   break;
					}
});

let pointer   = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', function(event) {
																	//rewrite without iDS
					let  local_intersection;
					pointer.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
					pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
					raycaster.setFromCamera( pointer, camera );
					//scene_intro
					if (process == "intro" ) {
						local_intersection = raycaster.intersectObject( scene_intro.sprites , true );
					 	 if ( (  local_intersection[0].object.name == "start" ) ||
						      (  local_intersection[0].object.name == "+" ) ) {
						  	scene_intro_sound_fire.start();
							change_scene();
					 	 }
					}													
					//scene_game
					if (process == "game" ) {
						local_intersection = raycaster.intersectObject( scene_game.objects , true );
						if ( (   local_intersection[0].object.name == "round"  ) ||
						     (   local_intersection[0].object.name == "square"  ) ) {
							if	  ( local_intersection[0].object.name == "round"  ) {
									scene_game_choice( scene_game.objects.stage.portalroundback_Plane );
							} else if ( local_intersection[0].object.name == "square"  ) {
									scene_game_choice( scene_game.objects.stage.portalsquareback_Plane );
							} else {
					      			switch ( local_intersection[1].object.name ) {
									case "portalroundback_Plane"  : scene_game_choice( scene_game.objects.stage.portalroundback_Plane );  break;
									case "portalsquareback_Plane" : scene_game_choice( scene_game.objects.stage.portalsquareback_Plane ); break;
								}
							}
						}

						  if  ( local_intersection[0].object.name == "top" ) scene_game_showscore();
						  if ( local_intersection[0].object.name == "bottom" ) 		change_scene();
						  
					}
					//scene_nav
					if (process == "nav" ) {										
						local_intersection = raycaster.intersectObject( scene_nav.sprites , true );
		
			
						 let  local_checkboxes_array = [ [ scene_nav.sprites.checkbox_on_jr  , scene_nav.sprites.checkbox_off_jr   ] ,
										      [ scene_nav.sprites.checkbox_on_mid , scene_nav.sprites.checkbox_off_mid  ] ,
										      [ scene_nav.sprites.checkbox_on_sr  , scene_nav.sprites.checkbox_off_sr   ]   ];
						
						switch ( local_intersection[0].object.name ) {
							case "jr"  : {
								 	scene_nav_sound_fire.start();
									change_checkboxes(0);
									level = "jr";
							} break;
							case "mid" : {
									scene_nav_sound_fire.start();
									change_checkboxes(1);
									level = "mid";
									scene_game_prepare();	
							} break;
							case "sr"  : {
									scene_nav_sound_fire.start();
									change_checkboxes(2);
									level = "sr";
									scene_game_prepare();
							} break;
							case "return" : {
									change_scene();
							}
						}
								
						 function change_checkboxes ( temp_select ) { 
							for ( let i = 0 ; i < 3 ;  i++ ) {
								local_checkboxes_array[i][0].position.z = - 0.05;
								local_checkboxes_array[i][1].position.z =   0.0;
							}
							switch ( temp_select ) {
								case 0 :  scene_nav.sprites.checkbox_on_jr .position.z = 0.05; scene_game_prepare(); break;
								case 1 :  scene_nav.sprites.checkbox_on_mid.position.z = 0.05; scene_game_prepare(); break;
								case 2 :  scene_nav.sprites.checkbox_on_sr .position.z = 0.05; scene_game_prepare(); break;
							}
						 }
					}
});

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
				temp.move.way = temp.position.distanceTo( temp.move.destination ); 
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
					temp.move.way = temp.position.distanceTo( temp.move.destination ); 
					move_array[i] = temp;
				} else {
					//delete obj
					move_array.splice( i , i + 1 );
				}
			}
		}
	}
}

function change_scene( ) {
	change_sound.start();

	switch (process) {
		
		case "intro" : {
		scene_intro.position.set(0 , 0 , 0);
		camera.position.set( 0 , 0 , 1.25 );
		move_array.push( [ scene_intro , new THREE.Vector3( 0 ,  1 ,  -1) , 0.001 ] );
		move_array.push( [ camera     , new THREE.Vector3( 0 ,  -1 , -2) , 0.0066 ] );
		setTimeout( function () {
			process = "game"
			camera.position.set( 0 , 0 , 1.25 );
			scene_game.position.set(0 , 0 , 0);
			scene_intro.position.set(0 , 0 , 0);
			move_array = [];
		} , 2000 );
		}; break;

	

		case "game" : {
		scene_game.position.set(0 , 0 , 0);
		camera.position.set( 0 , 0 , 1.25 );
		move_array.push( [ scene_game , new THREE.Vector3( 0 ,  1 ,  -1) , 0.001 ] );
		move_array.push( [ camera     , new THREE.Vector3( 0 ,  -1 , -2) , 0.0066 ] );
		setTimeout( function () {
			process = "nav"
			camera.position.set( 0 , 0 , 1.25 );
			scene_game.position.set(0 , 0 , 0);
			scene_nav.position.set(0 , 0 , 0);
			move_array = [];
		} , 2000 );
		}; break;

		case "nav" : {
		scene_nav.position.set(0 , 0 , 0);
		camera.position.set( 0 , 0 , 1.25 );
		move_array.push( [ scene_nav  , new THREE.Vector3( 0 ,  1 , -1) , 0.001 ] );
		move_array.push( [ camera     , new THREE.Vector3( 0 ,   -1 , -2) , 0.0066 ] );
		setTimeout( function () {
			process = "game";
			camera.position.set( 0 , 0 , 1.25 );
			scene_nav.position.set(0 , 0 , 0);
			scene_game.position.set(0 , 0 , 0);
			move_array = [];
		} , 2000 ); 
		}; break;

	}
}


function set_name( temp_object , temp_name ) {
	temp_object.name = temp_name;

	return temp_object;
}


function add_gridGroups( temp_scene ) {
	temp_scene.lights   = temp_scene.children[0];
	temp_scene.objects  = temp_scene.children[1];
	temp_scene.sprites  = temp_scene.children[2];
	temp_scene.textures = temp_scene.children[3];
	temp_scene.temp     = temp_scene.children[4];

	return temp_scene;
}


function add_gridNames ( temp_group ) {
	let local_array  = [];
	let local_string = "";
	for ( let i = 0 ; i < temp_group.children.length ; i++ ) {
		local_array.push( temp_group.children[ i ].name );
	}
	for ( let i = 0 ; i < temp_group.children.length ; i++ ) {
		local_string = local_array[ i ];
		temp_group[ local_string ] = temp_group.children[ i ];
	}
}

function add_sprite_object( temp_path , temp_name , temp_scene , temp_layer , temp_temp ) {
	//create basic object
	let local_mesh     = new THREE.Mesh( new THREE.PlaneGeometry( 0.1 , 0.1 ) ,  new THREE.MeshBasicMaterial( { color: 0xff0000 , transparent: true , opacity: 0.0 } ) );
	//create and edit sprite
	let local_loader   = loader_texture.load( temp_path );
	let local_material = new THREE.SpriteMaterial( { map: local_loader , color: 0xffffff , fog: true  , transparent: true  } ); 
	let local_sprite   = new THREE.Sprite( local_material );
	    local_sprite.scale.set( 1 , 1 , 1);
	    {
		if ( temp_layer == 0 ) { local_sprite.position.z =  0    };
		if ( temp_layer == 1 ) { local_sprite.position.z += 0.05 };
		if ( temp_layer == 2 ) { local_sprite.position.z += 0.10 };
		if ( temp_layer == 3 ) { local_sprite.position.z += 0.15 };
		if ( temp_layer == 4 ) { local_sprite.position.z += 0.20 };
		if ( temp_layer == 5 ) { local_sprite.position.z += 0.25 };
		if ( temp_layer == 6 ) { local_sprite.position.z += 0.30 };
		if ( temp_layer == 7 ) { local_sprite.position.z += 0.35 };
		if ( temp_layer == 8 ) { local_sprite.position.z += 0.40 };
		if ( temp_layer == 9 ) { local_sprite.position.z += 0.45 };
	    }
	//add sprite to mesh
	local_mesh.add( local_sprite );
	local_mesh.name = temp_name;
	//add object to scene
	if ( temp_temp === true ) {
		temp_scene.temp.add( local_mesh );
	} else  temp_scene.sprites.add( local_mesh );

	return local_mesh;
}

function add_click_space ( object , width , height , x , y , name) {
	let local_geometry = new THREE.PlaneGeometry( width , height);
    	let local_material = new THREE.MeshPhongMaterial( {color: 0x000000 , transparent: true , opacity: 0.0 } ); 
        let local_mesh = new THREE.Mesh( local_geometry, local_material );
	    local_mesh.position.x = x;	
	    local_mesh.position.y = y;
	    local_mesh.position.z = 0.5;
	    name == undefined ? local_mesh.name = "+" : local_mesh.name = name;
     	    if (object.parent.name !== "sprites" ) {
	    object.children[0] =  local_mesh ;
	    object.children[1] =  local_mesh ;
	    } else  object.children[1] =  local_mesh ;
	
}

//system

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
