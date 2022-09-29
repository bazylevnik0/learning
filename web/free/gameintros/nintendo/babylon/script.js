scene.clearColor.r = 0
scene.clearColor.g = 0
scene.clearColor.b = 0
var sound = new Audio("sound.mp3")
    sound.play()
	
//load space 
var sprites_managers_space        = []
var sprites_managers_space_clones = []
var sprites_space          = []
var sprites_space_clones   = []
for (let i = 0; i < 6; i++) {
	sprites_managers_space[i]        = new BABYLON.SpriteManager("", "space"+i+".png", 1 , {width: 960, height: 540} , scene); 
	sprites_managers_space_clones[i] = new BABYLON.SpriteManager("", "space"+i+".png", 1 , {width: 960, height: 540} , scene); 
	sprites_space[i]          = new BABYLON.Sprite("sprite_space_"+i         , sprites_managers_space[i]);
	sprites_space_clones[i]   = new BABYLON.Sprite("sprite_space_"+i+"clone" , sprites_managers_space_clones[i]);
 	sprites_space[i].width  = sprites_space_clones[i].width  = 8 + 2*i
	sprites_space[i].height = sprites_space_clones[i].height = 4 + 2*i
	sprites_space_clones[i].position.y = -8
}
sprites_space = sprites_space.concat(sprites_space_clones)
let blink_space = setInterval( function() {
	let random = Math.floor(Math.random()*2)
	    random == 0 ? random = false : random = true
	sprites_space[Math.floor(Math.random()*5)].isVisible = random 
},50)

//load main
var sprites_managers_main = []
var sprites_main = {
	line       : "line"       ,
	rectangle  : "rectangle"  ,
	key	   : "key"        ,
	indicator  : "indicator"  ,
	logo       : "logo"       ,
	logo_blick : "logo_blick" ,
	text       : "text"
}
for ( value in sprites_main ) {
	sprites_managers_main.push( new BABYLON.SpriteManager("", value+".png", 1 , {width: 1920, height: 1080} , scene)); 
	sprites_main[value] = new BABYLON.Sprite("sprite_main_"+value, sprites_managers_main.slice(-1)[0]);
	sprites_main[value].width  = 17
	sprites_main[value].height = 9
}
let check_colorBlink = true;
function  colorBlink() {
	if (check_colorBlink) {
		for ( value in sprites_main ) {
			if (value !== "key" 	   &&
			    value !== "indicator"  &&
			    value !== "logo_blick" &&
			    value !== "text"         ) {

			sprites_main[value].color.r = +Math.random().toPrecision(2)
			sprites_main[value].color.g = +Math.random().toPrecision(2)
			sprites_main[value].color.b = +Math.random().toPrecision(2)
			}
		}
	}
}
let check_indicatorBlink = false;
let  time_indicatorBlink = 100;
sprites_main.indicator.color.r = 1;
sprites_main.indicator.color.g = 0;
sprites_main.indicator.color.b = 0;
let indicatorBlink = setInterval( function() {
				if (check_indicatorBlink) {
					sprites_main.indicator.color.r = 1;
					sprites_main.indicator.color.g = 0;
					sprites_main.indicator.color.b = 0;
					setTimeout( function () {
							sprites_main.indicator.color.r = 0;
						} , time_indicatorBlink)
				}
} , time_indicatorBlink*2);
let textBlink = setInterval( function() {
					sprites_main.text.isVisible = true;
					setTimeout( function () {
							sprites_main.text.isVisible = false;
						} , 500)
} , 1000);


for ( value in sprites_main ) {
	       sprites_main[value].position.y = 6.5
}

sprites_main.line.isVisible = false

//load chars
var sprites_managers_m = []
var sprites_managers_l = []
var sprites_m = {
	obj: {
		stay_l : "stay_l" ,
		stay_r : "stay_r" ,
		run1_l : "run1_l" ,
		run1_r : "run1_r" ,
		run2_l : "run2_l" ,
		run2_r : "run2_r" ,
		jump_l : "jump_l" ,
		jump_r : "jump_r"
	}
}
var sprites_l = {
	obj: {
		stay_l : "stay_l" ,
		stay_r : "stay_r" ,
		run1_l : "run1_l" ,
		run1_r : "run1_r" ,
		run2_l : "run2_l" ,
		run2_r : "run2_r" ,
		jump_l : "jump_l" ,
		jump_r : "jump_r"
	}
}
for ( value in sprites_m.obj ) {
	sprites_managers_m.push( new BABYLON.SpriteManager("", "m_"+value+".png", 1 , {width: 72, height: 83} , scene)); 
	sprites_m.obj[value] = new BABYLON.Sprite("sprite_m_"+value, sprites_managers_m.slice(-1)[0]);
	sprites_m.obj[value].position.x = -10
	sprites_m.obj[value].position.y = -2.5
}
for ( value in sprites_l.obj ) {
	sprites_managers_l.push( new BABYLON.SpriteManager("", "l_"+value+".png", 1 , {width: 72, height: 83} , scene)); 
	sprites_l.obj[value] = new BABYLON.Sprite("sprite_l_"+value, sprites_managers_l.slice(-1)[0]);
	sprites_l.obj[value].position.x =  10
	sprites_l.obj[value].position.y = -2.5
}

var chars = {
	m : sprites_m ,
	l : sprites_l
}

chars.m.direction ="r";
chars.l.direction= "l";
function setSprite(active_sprite) {
	for (value in this.obj) value == active_sprite ? this.obj[value].isVisible = true : this.obj[value].isVisible = false
}

chars.m.setSprite = setSprite
chars.l.setSprite = setSprite

chars.m.setSprite("stay_r")
chars.l.setSprite("stay_l")


chars.m.run  = chars.l.run    = true
chars.m.jump = chars.l.jump   = false
chars.m.speed = chars.l.speed = 0.00
//0.05
let m_run = setInterval( function () {
	if (chars.m.run) {
		switch (chars.m.direction) {
			case "r" : {
				chars.m.setSprite("run2_r");
				setTimeout( ()=>{ chars.m.setSprite("run1_r") } , 100);
				setTimeout( ()=>{ chars.m.setSprite("stay_r") } , 200);
			}break;
			case "l" : {
				chars.m.setSprite("run2_l");
				setTimeout( ()=>{ chars.m.setSprite("run1_l") } , 100);
				setTimeout( ()=>{ chars.m.setSprite("stay_l") } , 200);
			}break;
		}
	} else  {
		switch ( chars.m.direction ) {
			case "l" : chars.m.jump == true ? chars.m.setSprite("jump_l") : chars.m.setSprite("stay_l"); break;
			case "r" : chars.m.jump == true ? chars.m.setSprite("jump_r") : chars.m.setSprite("stay_r"); break;
		}
	}
},300)
let l_run = setInterval( function () {
	if (chars.l.run) {
		switch (chars.l.direction) {
			case "r" : {
				chars.l.setSprite("run2_r");
				setTimeout( ()=>{ chars.l.setSprite("run1_r") } , 100);
				setTimeout( ()=>{ chars.l.setSprite("stay_r") } , 200);
			}break;
			case "l" : {
				chars.l.setSprite("run2_l");
				setTimeout( ()=>{ chars.l.setSprite("run1_l") } , 100);
				setTimeout( ()=>{ chars.l.setSprite("stay_l") } , 200);
			}break;
		}
	} else {
		switch ( chars.l.direction ) {
			case "l" : chars.l.jump == true ? chars.l.setSprite("jump_l") : chars.l.setSprite("stay_l"); break;
			case "r" : chars.l.jump == true ? chars.l.setSprite("jump_r") : chars.l.setSprite("stay_r"); break;
		}
	}
},300)

function jump (char) {
	let prev = char.run;
	char.jump = true;
	char.run  = false;
	switch ( char.direction ) {
		case "l" : char.setSprite("jump_l"); break;
		case "r" : char.setSprite("jump_r"); break;
	}
	char.up = setInterval( function () {
		if (char.obj.stay_l.position._y < -1.5 ) {
			 for (value in char.obj) char.obj[value].position._y += 0.1;
		} else {
			clearInterval(char.up)
			char.down = setInterval( function () {
				if (char.obj.stay_l.position._y > -2.5 ) {
				 	for (value in char.obj) char.obj[value].position._y -= 0.1;
				} else {
					clearInterval(char.down)
					switch ( char.direction ) {
						case "l" : char.setSprite("stay_l"); break;
						case "r" : char.setSprite("stay_r"); break;
					}
					char.jump = false;
					char.run = prev;
				}
			}, 50)
		}
	}, 50)
}

let check
let check_show = true
function show() {
      if(check_show) {
	sprites_main.line.isVisible = true
      	check_colorBlink = false
	changeColor(sprites_main.rectangle , 31 , 54  , 215)
	changeColor(sprites_main.line      , 31 , 54  , 215)
	changeColor(sprites_main.logo      , 12 , 152 , 254)
	//luigi from right side to center and jump and...
	function show0() {
     	     return new Promise((resolve, reject) => {
		let show_0_a = setInterval( function () {
			if (chars.l.obj.stay_l.position._x>0) {
				for (value in chars.l.obj) chars.l.obj[value].position._x -= 0.15;
			} else {
				clearInterval(show_0_a)
				jump(chars.l)
				//..and change main color 	
				setTimeout(()=>{	
					check_indicatorBlink = true
					changeColor(sprites_main.rectangle , 0  , 0  , 0 )
					changeColor(sprites_main.indicator , 31 , 54 , 205)
					changeColor(sprites_main.line      , 11 , 34 , 195)
					changeColor(sprites_main.logo      , 31 , 54 , 215)
			
				},250)
				setTimeout(()=>{
					//luigi go right
					chars.l.direction = "r"
					let show_0_b = setInterval( function () {
						if (chars.l.obj.stay_l.position._x<10) {
							for (value in chars.l.obj) chars.l.obj[value].position._x += 0.15;
						} else resolve(true)
					},50)
				},500)	
			}
		} , 50)
	    })	
	}
	//mario from right side to center and jump and...
	async function show1() {
           check = await show0()
       	   let show_1_a = setInterval( function () {
		if (chars.m.obj.stay_l.position._x<0) {
			for (value in chars.m.obj) chars.m.obj[value].position._x += 0.15;
		} else {
			clearInterval(show_1_a)
			jump(chars.m)
			//..and change main color 	
			setTimeout(()=>{	
				check_indicatorBlink = true
				changeColor(sprites_main.rectangle , 222 , 51  , 54 )
				changeColor(sprites_main.indicator , 255 , 134 , 166)
				changeColor(sprites_main.line      , 255 , 134 , 166)
				changeColor(sprites_main.logo      , 255 , 134 , 166)
			},250)
			setTimeout(()=>{
				//luigi go right
				chars.m.direction = "l"
				let show_1_b = setInterval( function () {
					if (chars.m.obj.stay_l.position._x>-10) {
						for (value in chars.m.obj) chars.m.obj[value].position._x -= 0.15;
					} else resolve(true)
				},50)
			},500)	
		}
	   } , 50) 
      	};
        show1()
     }
     check_show = false
}

function changeColor(obj,r,g,b) {
	obj.color.r = r/ 255
	obj.color.g = g/ 255
	obj.color.b = b/ 255
}
