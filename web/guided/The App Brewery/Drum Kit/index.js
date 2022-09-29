document.addEventListener("keydown", function (key) {
	document.querySelector("."+key.key).style.color = "white"
	switch(key.key) {
		case "w" : { 
			var audio = new Audio("sounds/tom-3.mp3"); 
			audio.play();
		} break;
		case "a" : { 
			var audio = new Audio("sounds/tom-4.mp3"); 
			audio.play();
		} break;
		case "s" : { 
			var audio = new Audio("sounds/tom-1.mp3"); 
			audio.play();
		} break;
		case "d" : { 
			var audio = new Audio("sounds/tom-2.mp3"); 
			audio.play();
		} break;
		case "j" : { 
			var audio = new Audio("sounds/kick-bass.mp3"); 
			audio.play();
		} break;
		case "k" : { 
			var audio = new Audio("sounds/snare.mp3"); 
			audio.play();
		} break;
		case "l" : { 
			var audio = new Audio("sounds/crash.mp3"); 
			audio.play();
		} break;
		default : console.log("?:",this) 
	}
	buttonAnimation(key.key)
})


var buttons = document.getElementsByTagName('button')
    buttons = [...buttons]
    buttons.forEach( element => element.addEventListener("click",function () {   
	this.style.color = "white"
	switch(this.innerHTML) {
		case "w" : { 
			var audio = new Audio("sounds/tom-3.mp3"); 
			audio.play();
		} break;
		case "a" : { 
			var audio = new Audio("sounds/tom-4.mp3"); 
			audio.play();
		} break;
		case "s" : { 
			var audio = new Audio("sounds/tom-1.mp3"); 
			audio.play();
		} break;
		case "d" : { 
			var audio = new Audio("sounds/tom-2.mp3"); 
			audio.play();
		} break;
		case "j" : { 
			var audio = new Audio("sounds/kick-bass.mp3"); 
			audio.play();
		} break;
		case "k" : { 
			var audio = new Audio("sounds/snare.mp3"); 
			audio.play();
		} break;
		case "l" : { 
			var audio = new Audio("sounds/crash.mp3"); 
			audio.play();
		} break;
		default : console.log("?:",this) 
	}
	buttonAnimation(this.innerHTML)
}))

function buttonAnimation( evt ) {
	console.log(evt)
	var active_button = document.querySelector("."+evt)
	    active_button.classList.add("pressed")
	setTimeout( ()=> active_button.classList.remove("pressed") , 100) 
}
