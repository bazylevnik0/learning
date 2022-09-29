//import
import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';
var loader_obj_c = new OBJLoader();
var loader_obj_o = new OBJLoader();
var loader_obj_l = new OBJLoader();
var loader_mtl_c = new MTLLoader();
var loader_mtl_o = new MTLLoader();
var loader_mtl_l = new MTLLoader();



//init
      //canvas & scene
const canvas = document.getElementById('container_div_right_canvas')
const scene = new THREE.Scene();
      //camera
			const camera = new THREE.PerspectiveCamera( 15, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
      //light
     const point_light_up = new THREE.PointLight( 0xffffff, 1, 100 );
point_light_up.position.set( 5, 5, 5 );
scene.add( point_light_up );

     const point_light_down = new THREE.PointLight( 0xffffff, 1, 100 );
point_light_down.position.set( 0, -5, 5 );
scene.add( point_light_down );
      //renderer
			const renderer = new THREE.WebGLRenderer({ canvas: canvas , alpha: true });
			renderer.setSize( canvas.clientWidth, canvas.clientHeight );
		
//load & set
//coffee
var coffee 
loader_mtl_c.load( 'https://bazylevnik0.github.io/practice/web/3dslider/coffee.mtl' ,     function( material ) {
                  material.preload();
                   loader_obj_c.setMaterials( material );
						     loader_obj_c.load('https://bazylevnik0.github.io/practice/web/3dslider/coffee.obj' , ( object ) => {
                      object.rotation.y = -2
                      object.rotation.x = 0.5
                      coffee = object
                        
                      scene.add( object );
													}
                                  
                                   );      
})
//orange
var orange 
loader_mtl_o.load( 'https://bazylevnik0.github.io/practice/web/3dslider/orange.mtl' ,     function( material ) {
                  material.preload();
                   loader_obj_o.setMaterials( material );
						     loader_obj_o.load('https://bazylevnik0.github.io/practice/web/3dslider/orange.obj' , ( object ) => {
                      object.rotation.y = -2
                      object.rotation.x = 0.5
                      orange = object
                        
                      scene.add( object );
													}
                                  
                                   );      
})

//lemon
var limon 
loader_mtl_l.load( 'https://bazylevnik0.github.io/practice/web/3dslider/limon.mtl' ,     function( material ) {
                  material.preload();
                   loader_obj_l.setMaterials( material );
						     loader_obj_l.load('https://bazylevnik0.github.io/practice/web/3dslider/limon.obj' , ( object ) => {
                      object.rotation.y = -2
                      object.rotation.x = 0.5
                      limon = object
                        
                      scene.add( object );
													}
                                  
                                   );      
})
//set & run 
camera.position.z = 15;
let loading = setInterval(function () {
  
    if ( coffee !== undefined &&
         orange !== undefined &&
         limon  !== undefined ) {
      
        coffee.visible = true
        orange.visible = false
        limon.visible = false
        
        animate();
    		clearInterval(loading)
    }

},100)
			const animate = function () {
				requestAnimationFrame( animate );
        
        coffee.rotation.y += 0.01
        orange.rotation.y += 0.01
        limon .rotation.y += 0.01
      
        renderer.render( scene, camera );
			};

//if resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    camera.aspect = ((window.innerWidth / 100) * 45) /  ((window.innerHeight / 100) * 65) ;
    camera.updateProjectionMatrix();
    renderer.setSize( (window.innerWidth / 100) * 45, (window.innerHeight / 100) * 65 );

}

//control
var position = 0
var navs = document.querySelectorAll('.fas')
    navs.forEach( function (el) {
      el.addEventListener("click", function() {
        let temp = this
        temp.style.color = "gray"
        setTimeout( function () {
          temp.style.color = "white" }, 100)
        switch (this.id) {
          case "left" : {
            position > 0 ? changeProduct( --position ) : false
          } break;
          case "right" : {
            position < 2  ? changeProduct( ++position ) : false
          } break;
          case "coffee" : { changeProduct(0); position = 0; } break;
          case "orange" : { changeProduct(1); position = 1; } break;
          case "limon"  : { changeProduct(2); position = 2; } break; 
        }
      })
    })

function changeProduct( pos ) {
    switch (pos) {
      case 0 : {
        coffee.visible = true
        orange.visible = false
        limon .visible = false
      } break;
        case 1 : {
        coffee.visible = false
        orange.visible = true
        limon .visible = false
      } break;
        case 2 : {
        coffee.visible = false
        orange.visible = false
        limon .visible = true
      } break;
    }
}
