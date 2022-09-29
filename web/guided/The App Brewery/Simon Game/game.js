console.log("script")

var button_colors = [ "red", "blue", "green", "yellow" ]
var random_chosen_color = ""
var user_chosen_color = ""
var user_chosen_color_id

var game_pattern = []
var user_pattern = []

var level = 0
var start = true
$(document).keypress( () => {  
	if (start) $("h1").text( "Level 0"); start = false; nextSequence();
})

var audio = {
	red    : new Audio("sounds/red.mp3") ,
	blue   : new Audio("sounds/blue.mp3") ,
	green  : new Audio("sounds/green.mp3") ,
	yellow : new Audio("sounds/yellow.mp3"),
	wrong  : new Audio("sounds/wrong.mp3")
}

function nextSequence() {
	user_pattern = []
	random_number = Math.floor(Math.random()*3);
	random_chose_color = button_colors[random_number]
	game_pattern.push(random_chose_color)
	$("."+random_chose_color).animate({opacity : '0.0'},150,()=>{$("."+random_chose_color).css("opacity","1.0")})
	$("h1").text( "Level " + (++level))
	step = level
}

var step;
$(".btn").click( function(el) {
    user_chosen_color = el.target.id
    user_pattern.push(user_chosen_color)
    console.log(user_chosen_color)
    console.log("game_pattern: ", game_pattern)
    console.log("user_pattern: ", user_pattern)
    playSound(user_chosen_color)
    animatePress(user_chosen_color)
    step == 1 ? checkAnswer(level) : step--
})

function playSound( color ) {
	audio[color].play()
}

function animatePress(color) {
	let temp = $("."+color)
	    temp.addClass("pressed")
	    setTimeout( ()=>{temp.removeClass("pressed")} , 100 )
}

function checkAnswer( level ) {
	let check = 1
	for (let i = 0 ; i < level; i++) {	
	game_pattern[i] == user_pattern[i] ? check *= 1 : check*=0 
	}
	if( check == 1 ) {
	 setTimeout( ()=> { nextSequence() } , 1000) 
	} else {
	 startOver()
	 audio.wrong.play()
	 $("body").addClass("game-over")
	 setTimeout( ()=> { $("body").removeClass("game-over") } , 200)
	 $("h1").text( "Game Over, Press Any Key to Restart" )
	}
}

function startOver() {
	level = 0
	game_pattern = []
	user_pattern = []
	start = true

}
