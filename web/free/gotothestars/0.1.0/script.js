//init variables
var camera, scene, light, light_ambient, renderer , composer;

//set loaders
const loader = new OBJLoader();
const loader_texture = new THREE.TextureLoader();
const loader_material = new MTLLoader();

//obj for control
const pointer = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

//logic
var score = 0;
var process = undefined;
var move_array = [];	

	
init();

function init() {
//init
	//camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
	camera.position.set( 0 , -4 , 6)	
	camera.rotation.set( -0.3 , 0, 0 )
	camera.layers.enable( 0 );
	camera.layers.enable( 1 );
	//scene
	scene = new THREE.Scene();
	
	/*
	//test objects
	//test three object 
	let geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
	let material = new THREE.MeshPhongMaterial( {color: 0xffffff} ); 
    	let mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//test .obj with .jpeg texture
	loader.load('obj/test.obj', ( object ) => {
					let texture = loader_texture.load( 'obj/test.jpeg' );
					object.children[0].material.map = texture;
				    	scene.add( object );
				    }
	);
	
	//test .obj with .mtl material .png uv
	loader_material.load('obj/test.mtl', function( material ) {
						     	material.preload();
						     	loader.setMaterials( material );
						     	loader.load('obj/test.obj', (object) => {
						     					   	object.children[0].material.color.r = 1;
												object.children[0].material.color.g = 1;
												object.children[0].material.color.b = 1;
												scene.add( object );
											    }
						     	);
						     }
	);
	*/

		
	//point light
	light = new THREE.PointLight( 0xffffff, 1, 25 );
	light.position.set( 0, -2.5, 0 );
	//add point light in scene
	scene.children[0] = light;
	
	//ambient light
	light_ambient = new THREE.AmbientLight( 0x404040 );
	//add ambient light in scene
	scene.children[1] = light_ambient;
		
	//all
	loader_material.load('obj/all.mtl', function( material ) {
						     	material.preload();
						     	loader.setMaterials( material );
						     	loader.load('obj/all.obj', (object) => {
						     					//add obj in scene
												scene.children[2] = object;
											//set clear under color
												//portal right
													scene.children[2].children[0].material.color.r = 1;
													scene.children[2].children[0].material.color.g = 1;
													scene.children[2].children[0].material.color.b = 1;
												//portal left
													scene.children[2].children[1].material.color.r = 1;
													scene.children[2].children[1].material.color.g = 1;
													scene.children[2].children[1].material.color.b = 1;
												//back
													scene.children[2].children[4].material.color.r = 1;
													scene.children[2].children[4].material.color.g = 1;
													scene.children[2].children[4].material.color.b = 1;
											//set normal maps
												//portal right
													scene.children[2].children[0].material.normalMap = loader_texture.load( 'obj/normal.png' );
												//portal right
													scene.children[2].children[1].material.normalMap = loader_texture.load( 'obj/normal.png' );
											//set start position & scale
												scene.children[2].scale.set( 5, 5, 5 );
												scene.children[2].position.set( 0, -7, 0 );
										    		scene.children[2].rotation.y = 4;
										  	//set statuses 									!!!ПЕРЕДЕЛАТЬ
												//set info about changeable
													scene.children[2].children[5].material.changeable = 1;
													scene.children[2].children[6].material.changeable = 1;
												//set info about form
													scene.children[2].children[5].form = "cube";
													//.layers.set(1);
													//scene.children[2].children[5].layers.enable(1);
													scene.children[2].children[5].layers.enable(1);
													scene.children[2].children[2].form = "cube";
													scene.children[2].children[6].form = "sphere";
													scene.children[2].children[6].layers.enable(1);
													scene.children[2].children[3].form = "sphere";
										}
						     	);
					     }
	);


//activate
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	let loading = setInterval( function() { 
					//activate animation loop
				 	if (scene.children[scene.children.length-1] !== undefined) { 
						clearInterval(loading); 
						renderer.setAnimationLoop( animation ); 
				 	} 
				 } , 1000 );
}

//control
	document.addEventListener( 'mousedown', mouse_down );
	function mouse_down( event ) {
		pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( pointer, camera );
		let intersection = raycaster.intersectObject( scene.children[2], true );
		if ( intersection.length >= 0 ) {
			if ( intersection[ 0 ].object.material.changeable === 1 ) {
				intersection[ 0 ].object.material.color.r = Math.random();
				intersection[ 0 ].object.material.color.g = Math.random();
				intersection[ 0 ].object.material.color.b = Math.random();
				choice( intersection[ 0 ].object );
			}
		}
	}	


//posteffect
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const bloomPass = new BloomPass(
     		 1,    // strength
     		 250,   // kernel size
      		 400,    // sigma ?
      		 2,  // blur render target resolution
  	);
  	composer.addPass(bloomPass);

 	 const filmPass = new FilmPass(
      		10,   // noise intensity
      		0.025,  // scanline intensity
      		648,    // scanline count
     		false,  // grayscale
 	 );
  	filmPass.renderToScreen = true;
  	composer.addPass(filmPass);
	

//render
var inhale = true, exhale = false, size = 1;
function animation( time ) {
	 //life
	 if (inhale === true) {
			size -= 0.01;
			if (size > -0.5) {
	
			
			} else { inhale = false; exhale =  true; }
		
	 }
	 if (exhale === true) {
			size += 0.01; 
			if (size < 0.5) {
			
			} else { inhale = true; exhale =  false; }
		
	 }
	
	//move
	move();
	//processing
	processing();

	//render	
	//renderer.render(scene, camera); 
	//composer.render();
//requestAnimationFrame(animation);

	renderer.autoClear = false;

	 renderer.clear();
  
  camera.layers.set(1);
  composer.render();
  
  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);

/*
requestAnimationFrame(animation(time));
renderer.autoClear = false;

  renderer.clear();
  
  camera.layers.set(1);
  composer.render();
  
  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
*/
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
		} else {
			--score;
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

	function processing () {
		if (process = "intro") {

		}
		if (process = "nav") {

		}
		if (process = "game") {

		}
		if (process = "exit") {

		}

	}
