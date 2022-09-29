console.log( "app.js" );
console.log( "sound from https://developer.dolby.com/tools-media/sample-media/sample-sound-library/" )
import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';


let sound_in = new Audio("sounds/in.mp3");
let sound_air = new Audio("sounds/air.mp3");
let sound_air_ = new Audio("sounds/air_.mp3");
let sound_shot = new Audio("sounds/shot.mp3");
document.addEventListener( "click", function() {
	    sound_in.play();
})
								
const scene = new THREE.Scene();
      scene.visible = false;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var timers = []

//load
//earth
var earth = {
	loaded   : false,
	map      : [],
	material : undefined,
	sprite   : undefined,
	build    : function () {		
			function loadMaps() {
				return new Promise((resolve, reject) => {
					for (let i = 0; i < 22; i++) { earth.map[i] = new THREE.TextureLoader().load( './earth/' + i + '.png' ); }
					let timer = setInterval( function () {
						if ( earth.map[21] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function loadMat() {
 	 		await loadMaps()
				return new Promise((resolve , reject) => {	
					earth.material = new THREE.SpriteMaterial( { map: earth.map[0] } ) 
					let timer = setInterval( function () {
						if (earth.material !== undefined ) {
							clearInterval(timer)
							resolve(true)
						}
					} , 100);
				})
			}
			async function createSprite() {
 			await loadMat()
				earth.sprite = new THREE.Sprite( earth.material );
				earth.sprite.name = "earth"
				scene.add(earth.sprite)
				earth.loaded = true;
			}
			createSprite()
		 },
	rotate   : {
		 check  : false,
		 step   : 0,
		 start  : function () {
				earth.rotate.check = true;
				this.timer = setInterval( function() {
					earth.rotate.check == false ? clearInterval(this.timer) : false	
					earth.sprite.material.map = earth.map[""+earth.rotate.step]
					earth.rotate.step == 21 ? earth.rotate.step = 0 : earth.rotate.step++ 
				},1000/8)
		       }
		 }
}
	
//stars
var stars = {
	loaded   : false,
	map      : new THREE.TextureLoader().load( 'star.png' )  ,
	material : undefined ,
	sprite   : undefined ,
	groups   : [ new THREE.Group() , new THREE.Group() , new THREE.Group() ],
	build    : function () {
			let timer_map = setInterval( ()=> {
				if (stars.map !== undefined) {
					stars.material = new THREE.SpriteMaterial( { map: stars.map } )
					clearInterval(timer_map);
					let timer_material = setInterval( ()=> {
						if(stars.material !== undefined) {
							stars.sprite   = new THREE.Sprite( stars.material )
							clearInterval(timer_material)
							let timer_sprite = setInterval( ()=> {
								if(stars.sprite !== undefined ){
									stars.sprite.scale.x = stars.sprite.scale.y = 0.25;
									clearInterval(timer_sprite)
									fill()
								}
							},100)
						}
					} , 100) 
				}
			},100)
			function fill() {
				let array = [];
				let  x ,  y ,  z ,
				    rx , ry , rz , check
				for (let i = 0 ; i < 28; i+=4) {
					for (let j = 0; j < 60; j+=4) {
							check = Math.floor(Math.random()*2);
							if (check == 1) {
								rx = Math.random()
								ry = Math.random()
								rz = Math.random()
								x = j - 28 + rx
								y = i - 12 + ry
								let temp_a = stars.sprite.clone()
								    temp_a.position.x = x
								    temp_a.position.y = y
								    temp_a.position.z = rz * 10
								    stars.groups[0].add(temp_a)
								x *= (-1)
								y *= (-1)
								let temp_b = stars.sprite.clone()
								    temp_b.position.x = x
								    temp_b.position.y = y
								    temp_b.position.z = rz * 10 * (-1)
								    stars.groups[1].add(temp_b)
								x *= (-1)
								y *= (-1)
								let temp_c = stars.sprite.clone()
								    temp_c.position.x = x
								    temp_c.position.y = y
								    temp_c.position.z = rz * 10 * (-1)
								    stars.groups[2].add(temp_c)
							}

					}
				}
				stars.groups[0].name = "stars_a"
				stars.groups[1].name = "stars_b"
				stars.groups[2].name = "stars_c"
				stars.groups[0].position.z = -14
				stars.groups[1].position.z = -9
				stars.groups[2].position.z = -4
				scene.add(stars.groups[0],stars.groups[1],stars.groups[2])
				stars.loaded = true
			}
		 },
	move     : {
		  check : false,
		  start : function () {
				stars.move.check = true
				let timer = setInterval( function () {
					stars.move.check == false ? clearInterval(timer) : false
					stars.groups[0].position.z < -4 ? stars.groups[0].position.z += 0.5 : stars.groups[0].position.z = -14	
					stars.groups[1].position.z < -4 ? stars.groups[1].position.z += 0.5 : stars.groups[1].position.z = -14	
					stars.groups[2].position.z < -4 ? stars.groups[2].position.z += 0.5 : stars.groups[2].position.z = -14	
				},1000/12)
		        }
		 }
}

//asteroids	
var asteroids = {
	loaded    : false,
	map       : [],
	material  : [],
	sprite    : [],
	groups   : [ new THREE.Group() , new THREE.Group() , new THREE.Group() ],
	build    : function () {
			function loadMaps() {
				return new Promise((resolve, reject) => {
					for (let i = 0 ; i < 6 ; i++) { asteroids.map.push( new THREE.TextureLoader().load( './asteroids/' + i + '.png' )); }
					let timer = setInterval( function () {
						if ( asteroids.map[5] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						}
					} , 100 );
				})
			}
			async function loadMat() {
 	 		await loadMaps()
				return new Promise((resolve , reject) => {
					for (let i = 0 ; i < 6 ; i++) { asteroids.material.push( new THREE.SpriteMaterial( { map: asteroids.map[i] } )); }
					let timer = setInterval( function () {
						if (asteroids.material[5] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						}
					} , 100);
				})	
			}
			async function createSprite() {
 			await loadMat()
				for( let i = 0; i < 6; i++) { asteroids.sprite.push( new THREE.Sprite( asteroids.material[i] )); }
				fill()
			}
			createSprite()
			function fill() {
				let  x ,  y ,  z , obj, scale_x , scale_y , rotate,
				    rx , ry , rz , check
				for (let i = 0 ; i < 7; i++) {
					for (let j = 0; j < 15; j+=2) {
						check = Math.floor(Math.random()*2);
						if (check == 1) {
							rx = Math.random()
							ry = Math.random()
							rz = Math.random()
							x = j - 7 + rx
							y = i - 3 + ry
							obj = Math.ceil(Math.random()*5)
							scale_x = Math.random()*2
							scale_y = Math.random()*2
							rotate = Math.random()*5
							let temp_a = asteroids.sprite[obj].clone()
							    temp_a.rotation.x = rotate
							    temp_a.position.set( x , y , rz * 10)
							    temp_a.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[0].add(temp_a)
							x *= (-1)
							y *= (-1)
							scale_x = Math.random()*2
							scale_y = Math.random()*2
							obj = Math.ceil(Math.random()*5)
							rotate = Math.random()*5
							let temp_b = asteroids.sprite[obj].clone()
					   		    temp_b.rotation.x = rotate		
							    temp_b.position.set( x , y , rz * 10)
							    temp_b.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[1].add(temp_b)
							x *= (-1)
							y *= (-1)
							scale_x = Math.random()*2+1
							scale_y = Math.random()*2+1
							rotate = Math.random()*2*Math.PI
							obj = Math.ceil(Math.random()*5)
							let temp_c = asteroids.sprite[obj].clone()
							    temp_c.rotation.x = rotate		
							    temp_c.position.set( x , y , rz * 10)
							    temp_c.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[2].add(temp_c)
						}
					}
				}
				asteroids.groups[0].name = "asteroids_a"
				asteroids.groups[1].name = "asteroids_b"
				asteroids.groups[2].name = "asteroids_c"
				asteroids.groups[0].position.z = -14
				asteroids.groups[1].position.z = -7
				asteroids.groups[2].position.z = 5
				scene.add(asteroids.groups[0],asteroids.groups[1],asteroids.groups[2])
				asteroids.loaded = true;
			}
		 },
	refill   : function (name){
				let num
				switch(name){
					case "asteroids_a" : num = 0; break;
					case "asteroids_b" : num = 1; break;
					case "asteroids_c" : num = 2; break;
				}
				scene.children.forEach( (child) => {
					if (child.name == name) {
						child.clear()
						child =  new THREE.Group();
						child.name = name
					} 
				})
				let  x ,  y ,  z , obj, scale_x , scale_y , rotate , 
				    rx , ry , rz , check
				for (let i = 0 ; i < 7; i+=2) {
					for (let j = 0; j < 15; j+=Math.ceil(Math.random()*3)) {
						if ( j !== 7 ) {
							j !== 6
							check = Math.floor(Math.random()*2);
							if (check == 1) {
								rx = Math.random()
								ry = Math.random()
								rz = Math.random()
								x = j - 7 + rx
								y = i - 3 + ry
								obj = Math.ceil(Math.random()*5)
								scale_x = Math.random()*2+1
								scale_y = Math.random()*2+1	
								rotate = Math.random()*2*Math.PI
								let temp = asteroids.sprite[obj].clone()
								    temp.material.rotation = rotate
								    temp.position.set( x , y , rz * 5)
								    temp.show = function (local,x,y) {
									let local_x = x
									let local_y = y
									local.scale.set(x/4,y/4,1)
									local.timer = setInterval( function() {
										if ( local.scale.x < x) {
											local.scale.set( local.scale.x += 0.025 ,  local.scale.y += 0.025 , 1)
										} else clearInterval(local.timer)
										if ( local.position.z > 4 ) clearInterval(local.timer)
								 	   } ,50)
								    }
								    temp.show(temp,scale_x,scale_y);
								    asteroids.groups[num].add(temp)
							}
					       }
					}
				}
	},
	move     : {
		  check : false,
		  start : function () {
				asteroids.move.check = true
				let timer = setInterval( function () {
					asteroids.move.check == false ? clearInterval(timer) : false
					asteroids.groups.forEach( el => {
						if ( el.position.z < 5 ) {
							 el.position.z += 1 
						} else {
							 el.position.z = -14
							 asteroids.refill(el.name)
						}		
					});
				},1000/12)
		        }
		 }
}
//main stone
var   stone = {
	map      : undefined,
	material : undefined,
	sprite   : undefined,
	build    : function() {
			function createMap() {
				return new Promise((resolve ,reject) =>{
					stone.map = new THREE.TextureLoader().load( 'asteroids/main.png' );
					let timer = setInterval( ()=>{
						if(stone.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					stone.material = new THREE.SpriteMaterial( { map: stone.map } )
					let timer = setInterval( ()=>{
						if(stone.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				stone.sprite = new THREE.Sprite( stone.material );
				stone.sprite.scale.set( 6.25 , 3.75 , 1)
				scene.add(stone.sprite)
			}
			createSprite()
	}
}


//symbols
var symbols = {
		loaded     : false,
		text	   : {
				map: undefined,
				material: undefined,
				sprite : undefined,
				build  : function () {
						
			function createMap() {
				return new Promise((resolve ,reject) =>{
					symbols.text.map = new THREE.TextureLoader().load( 'symbols/text.png' );
					let timer = setInterval( ()=>{
						if(symbols.text.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					symbols.text.material = new THREE.SpriteMaterial( { map: symbols.text.map } )
					let timer = setInterval( ()=>{
						if(symbols.text.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				symbols.text.sprite = new THREE.Sprite( symbols.text.material );
				symbols.text.sprite.scale.set( 15.25 , 6.75 , 1)
				scene.add(symbols.text.sprite)
			}
			createSprite()
				       }
			      },
		logo_all   : {
				map: undefined,
				material: undefined,
				sprite : undefined,
				build  : function () {
						
			function createMap() {
				return new Promise((resolve ,reject) =>{
					symbols.logo_all.map = new THREE.TextureLoader().load( 'symbols/logo_all.png' );
					let timer = setInterval( ()=>{
						if(symbols.logo_all.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					symbols.logo_all.material = new THREE.SpriteMaterial( { map: symbols.logo_all.map } )
					let timer = setInterval( ()=>{
						if(symbols.logo_all.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				symbols.logo_all.sprite = new THREE.Sprite( symbols.logo_all.material );
				symbols.logo_all.sprite.scale.set( 8 , 2 , 1)
				scene.add(symbols.logo_all.sprite)
			}
			createSprite()
				       }
			     },
		logo_split : {
			logo_r     : new SimpleSymbolSprite("logo_r"),
			logo_e     : new SimpleSymbolSprite("logo_e"),
			logo_a     : new SimpleSymbolSprite("logo_a"),
			logo_l     : new SimpleSymbolSprite("logo_l"),
			logo_red   : new SimpleSymbolSprite("logo_red"),
			logo_green : new SimpleSymbolSprite("logo_green"),
			logo_blue  : new SimpleSymbolSprite("logo_blue"),
			move	   : {
					check : false,
					start : function () {
						symbols.logo_split.move.check = true
						for(let value in symbols.logo_split) {
							if ( value !== "move") {
								symbols.logo_split[value].sprite.position.set( Math.random()*14 -7 , Math.random()*6 - 3 , (-1) * (Math.random()*42) );
								symbols.logo_split[value].sprite.material.rotation = Math.random()*Math.PI*2;
							}
						}
						let timer = setInterval( function() {
							
							for(let value in symbols.logo_split) {
								if ( value !== "move") {
									symbols.logo_split[value].sprite.position.z += 0.25;
									symbols.logo_split[value].sprite.material.rotation += 0.025;	
									if ( symbols.logo_split[value].sprite.position.z > 3 ) {
										symbols.logo_split[value].sprite.position.set( Math.random()*14 -7 , Math.random()*6 - 3 , -42  );
										symbols.logo_split[value].sprite.material.rotation = Math.random()*Math.PI*2;
									}
								}
							}
							if ( symbols.logo_split.move.check == false ) clearInterval(timer)
						},25)
				        }
				     }
		},
		build : function() {	

symbols.text.build()	
symbols.logo_all.build()
symbols.logo_split.logo_r    .build(symbols.logo_split.logo_r)
symbols.logo_split.logo_e    .build(symbols.logo_split.logo_e)
symbols.logo_split.logo_a    .build(symbols.logo_split.logo_a)
symbols.logo_split.logo_l    .build(symbols.logo_split.logo_l)
symbols.logo_split.logo_red  .build(symbols.logo_split.logo_red)
symbols.logo_split.logo_green.build(symbols.logo_split.logo_green)
symbols.logo_split.logo_blue .build(symbols.logo_split.logo_blue)
let check = setInterval( function () {
		if(symbols.loaded == true) {
			clearInterval(check)
		} else {
			let complete = true
			for( let value in symbols.logo_split){
				if(value !== "move"){
					complete = complete && symbols.logo_split[value].loaded
				}
			} 
			complete == true ? symbols.loaded = true : false
		}
	},100)
		}
}



function SimpleSymbolSprite(name) {
	this.loaded   = false;
	this.map      = undefined;
	this.material = undefined;
	this.sprite   = undefined;
	this.build    = function (obj) {
			function createMap() {
				return new Promise((resolve ,reject) =>{
					obj.map = new THREE.TextureLoader().load( 'symbols/'+name+'.png' );
					let timer = setInterval( ()=>{
						if(obj.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					obj.material = new THREE.SpriteMaterial( { map: obj.map } )
					let timer = setInterval( ()=>{
						if(obj.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				obj.sprite = new THREE.Sprite( obj.material );
				if(name == "logo_red"   ||
				   name == "logo_green" ||
				   name == "logo_blue"     ) {
					obj.sprite.scale.set( 0.35 , 0.35 , 1)
				} else  obj.sprite.scale.set( 1.5  , 1.15 , 1)
				scene.add(obj.sprite)
			}
			createSprite()
			this.loaded = true;
			}
}

//set
stars    .build()
asteroids.build()
stone    .build()
earth    .build()
symbols  .build()




//show
let loaded = setInterval( function () {
	if(earth.loaded     == true &&
	   stars.loaded     == true && 
	   asteroids.loaded == true &&
	   symbols.loaded   == true   ) {		
		//
		console.log(scene)
		//
		earth.rotate.start()
		stars.move.start()
		asteroids.move.start()
		symbols.logo_split.move.start()

		clearInterval(loaded)
		scene.children.forEach(el => el.visible = false)
		animate()
		show()

	}
},500)

function show() {
	console.log("show")		
        scene.visible = true;

      //step 1
	function step1a() {
		return new Promise ((resolve , reject)=>{
			//camera set to left
			//show stars
			stars.groups[0].visible = true;
			stars.groups[1].visible = true;
			stars.groups[2].visible = true;
			//camera rotate
			setTimeout( ()=>{
				let timer = setInterval(function() {
					if(camera.rotation.y < 0.5){
						camera.rotation.y += 0.0025
					} else {
						clearInterval(timer)
						resolve(true)
					}
				},10)
			},2000);
		})
 	}
	async function step1b() {
	await step1a()
		return new Promise ((resolve , reject)=>{
			//show earth
			earth.sprite.position.set(3,0,)
			earth.sprite.scale.set(0.25,0.25)
			earth.sprite.visible = true
			//earth and camera rotate
			let earth_to_left  = true
			let earth_to_right = false
			let x , y , angle = 45
			let timer = setInterval(function() {
				camera.rotation.y > 0 ? camera.rotation.y -= 0.001 : false
				x = Math.cos((angle * Math.PI)/180)*9+2
				y = Math.sin((angle * Math.PI)/180)*3+0
				earth.sprite.position.set(x,y,0)
				earth.sprite.scale.set(	earth.sprite.scale.x+=0.01 , earth.sprite.scale.y+=0.01 , 0)
				angle+=0.5
				if(angle>360){
					clearInterval(timer)
					resolve(true)
				}
			},10);
		})
	}
	async function step1c () {
	await step1b()
		return new Promise((resolve, reject)=> {
		//show asteroids
		asteroids.groups[0].scale.set(0,0,1)
		asteroids.groups[1].scale.set(0,0,1)
		asteroids.groups[2].scale.set(0,0,1)
	
		asteroids.groups[0].visible = true;
		asteroids.groups[1].visible = true;
		asteroids.groups[2].visible = true;
		sound_air.play();		
		for (let i = 0 ; i < 10 ; i++) {
			let r = Math.random()*7
			setTimeout( ()=>sound_air.play(),r*1000)
		}
		let timer = setInterval( function () {			
				asteroids.groups[0].scale.set(	asteroids.groups[0].scale.x += 0.025 , 	asteroids.groups[0].scale.y += 0.025 , 1)
				asteroids.groups[1].scale.set(	asteroids.groups[1].scale.x += 0.025 , 	asteroids.groups[1].scale.y += 0.025 , 1)
				asteroids.groups[2].scale.set(	asteroids.groups[2].scale.x += 0.025 , 	asteroids.groups[2].scale.y += 0.025 , 1)

				asteroids.groups[0].scale.x >= 1 ? clearInterval(timer) : false
		},50)
		//show split symbols
		setTimeout( function() {
			for(let value in symbols.logo_split) {
			sound_air.play();			
			setTimeout( ()=>sound_air.play(),750)
				value !== "move" ? symbols.logo_split[value].sprite.scale.set(0,0,1) : false
			}
			for(let value in symbols.logo_split) {
				if ( value !== "move") {
				symbols.logo_split[value].sprite.visible = true;
				}
			}
			setTimeout( ()=>sound_air.play(),1000)
			setTimeout( ()=>sound_air.play(),2000)
			setTimeout( ()=>sound_air.play(),5000)
			setTimeout( ()=>sound_air.play(),5000)
			setTimeout( ()=>sound_air.play(),7500)
			setTimeout( ()=>sound_air.play(),9000)
			let timer = setInterval( function () {	
				for(let value in symbols.logo_split) {
					if ( value !== "move") {
						if ( value == "logo_red"   ||
						     value == "logo_green" ||
						     value == "logo_blue"    ) {
							 symbols.logo_split[value].sprite.scale.x += 0.005	
							 symbols.logo_split[value].sprite.scale.y += 0.005 
						} else {
						 	 symbols.logo_split[value].sprite.scale.x += 0.01	
							 symbols.logo_split[value].sprite.scale.y += 0.01 
						}
					}
				}	
				symbols.logo_split.logo_a.sprite.scale.x >= 1 ? clearInterval(timer) : false 
			},25)
		},5000)
		//hide asteroids & split symbols
 		setTimeout( function() {
			sound_air.play();			
			setTimeout( ()=>sound_air.play(),500)
			for(let value in symbols.logo_split) {
				value !== "move" ? symbols.logo_split[value].sprite.visible = false : false
			}
			asteroids.groups[0].visible = false;
			asteroids.groups[1].visible = false;
			asteroids.groups[2].visible = false;
			let timer = setInterval( function() {
				stars.groups[0].position.z += 0.05
				stars.groups[1].position.z += 0.05
				stars.groups[2].position.z += 0.05
				stars.groups[0].scale.set( stars.groups[0].scale.x += 0.0025, stars.groups[0].scale.y += 0.0025 , 1)
				stars.groups[1].scale.set( stars.groups[1].scale.x += 0.0025, stars.groups[1].scale.y += 0.0025 , 1)
				stars.groups[2].scale.set( stars.groups[2].scale.x += 0.0025, stars.groups[2].scale.y += 0.0025 , 1)
			},10)
			setTimeout( ()=> { clearInterval(timer); resolve(true) }, 1000)
		},19000)
		})
		console.log("step1")
	}
	//step 2
	let logo_r = symbols.logo_split.logo_r.sprite
	let logo_e = symbols.logo_split.logo_e.sprite
	let logo_a = symbols.logo_split.logo_a.sprite
	let logo_l = symbols.logo_split.logo_l.sprite

	let logo_red   = symbols.logo_split.logo_red.sprite
	let logo_green = symbols.logo_split.logo_green.sprite
	let logo_blue  = symbols.logo_split.logo_blue.sprite
	
	async function step2a() {
	await step1c()
		symbols.logo_split.move.check = false
		return new Promise((resolve, reject)=> {
			for(let value in symbols.logo_split) {
				value !== "move" ? symbols.logo_split[value].sprite.visible = true : false
				value !== "move" ? symbols.logo_split[value].sprite.position.z = 0 : false
				if( value == "logo_red"   ||
				    value == "logo_green" ||
				    value == "logo_blue"    ) {
						   symbols.logo_split[value].sprite.scale.set(0.25,0.25,1)
						   symbols.logo_split[value].sprite.visible = false
				}
			}

			function journey (obj,pos) {
				obj.position.x !== pos ? obj.position.x += (pos - obj.position.x) / 25 : false
		       		obj.position.y !== 2.5 ? obj.position.y += (2.5 - obj.position.y) / 25 : false
				obj.material.rotation -= obj.material.rotation/25
			} 
			
			sound_air_.play()
			let timer_count = 0
			let timer = setInterval( function() {
				for(let value in symbols.logo_split) {
				    if( value !== "move" ) {
					switch (value) {
						case "logo_r"     :  journey(logo_r    ,(-1.5)); break;
						case "logo_e"     :  journey(logo_e    ,(-0.2)); break;
						case "logo_a"     :  journey(logo_a    ,( 1.0)); break;
						case "logo_l"     :  journey(logo_l    ,( 2.2)); break;
						case "logo_red"   :  journey(logo_red  ,(-0.9)); break;
						case "logo_green" :  journey(logo_green,( 0.4)); break;
						case "logo_blue"  :  journey(logo_blue ,( 1.5)); break;
					}
				    }
				}
				if (timer_count == 200) {
					 var gendalf_say = "'I’m looking for someone to share in an adventure.' The Hobbit: An Unexpected Journey"
					 clearInterval(timer)
					 resolve(true) 
				} else  timer_count++
			},25)
		})
	}
	var temp_group
	async function step2b() {
	await step2a()
		return new Promise((resolve, reject)=> {
			temp_group = new THREE.Group()
			for(let value in symbols.logo_split) {
			    value !== "move" ? temp_group.add(symbols.logo_split[value].sprite) : false
			}
			scene.add(temp_group)
			let timer = setInterval( function () {
			    if ( temp_group.position.y > -6.5 ) {
				 temp_group.position.y -= 0.05 
				 temp_group.scale.set( temp_group.scale.x += 0.005 , temp_group.scale.y += 0.005 , 1) 
			    } else {
				 clearInterval(timer) 
				 resolve(true)
			    }

			}, 25)
		})
	}
	async function step2c() {
	await step2b()
		sound_shot.play()
		return new Promise((resolve, reject)=> {		
			stone.sprite.position.z = -50
			stone.sprite.material.rotation = 6 * Math.PI
			stone.sprite.visible = true
			let timer = setInterval( function () {
				if ( stone.sprite.position.z < 0) {
				     stone.sprite.position.z       += 50 / 100
			             stone.sprite.material.rotation -= (6 * Math.PI) / 100
				} else { 
				     clearInterval(timer)
				     resolve(true)
				}
			},25)
		})
	}
	async function step2d() {
	await step2c()
		return new Promise((resolve, reject)=> {
			let timer = setInterval( function () {
				if (temp_group.position.y < -5.75) {
					temp_group.position.y += 0.05				 
				 	temp_group.scale.set( temp_group.scale.x += 0.01 , temp_group.scale.y += 0.01 , 1) 
				} else 	if (temp_group.position.y >= -5.75 && temp_group.position.y < -4.25 ) {
					temp_group.position.y += 0.05				 
				 	temp_group.scale.set( temp_group.scale.x -= 0.01 , temp_group.scale.y -= 0.01 , 1) 
				} else {
					symbols.text.sprite.visible = true
					symbols.logo_split.logo_red.sprite.visible   = true
					symbols.logo_split.logo_green.sprite.visible = true
					symbols.logo_split.logo_blue.sprite.visible  = true
					clearInterval(timer)
					resolve(true)
				}
			},25)
		})
	}
	async function run() {
	await step2d()
		console.log("end")
	}
	run()
}

//
//animate
const animate = function () {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
};

animate();
//
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

