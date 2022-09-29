//html objects to js objs
image1 = document.getElementById("image1")
image2 = document.getElementById("image2")
title  = document.getElementById("title")

//random numbers to vars
var randomNumber1 , randomNumber2 
randomNumber1 = Math.ceil(Math.random()*6)
randomNumber2 = Math.ceil(Math.random()*6)

//vars(random numbers) to html 
image1.setAttribute("src","images/dice"+randomNumber1+".png")
image2.setAttribute("src","images/dice"+randomNumber2+".png")
console.log(randomNumber1,randomNumber2)

//change title
if(randomNumber1 > randomNumber2) {
       title.innerHTML = "Player 1 wins!"
} else if (randomNumber1 < randomNumber2) {
       title.innerHTML = "Player 2 wins!"
} else title.innerHTML = "----draw-----"
