var ctx 

var line  = new Image();
var color = new Image();
    color.id = "color";
var cloudl1 = new Image();
var cloudr1 = new Image();
var cloudl2 = new Image();
var cloudr2 = new Image();
function init() {
  if (window.innerWidth > 2100) { 
  	line.src    = 'https://bazylevnik0.github.io/practice/web/2danimations/main/line+.png';
  	color.src   = 'https://bazylevnik0.github.io/practice/web/2danimations/main/color+.png';
  	cloudl1.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudl1+.png';
  	cloudl2.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudl2+.png';
  	cloudr1.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudr1+.png';
  	cloudr2.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudr2+.png';
  } else {
  	line.src    = 'https://bazylevnik0.github.io/practice/web/2danimations/main/line.png';
  	color.src   = 'https://bazylevnik0.github.io/practice/web/2danimations/main/color.png';
  	cloudl1.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudl1.png';
  	cloudl2.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudl2.png';
  	cloudr1.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudr1.png';
  	cloudr2.src = 'https://bazylevnik0.github.io/practice/web/2danimations/main/cloudr2.png';
  }
  cloudr2.onload = function() {
	ctx = document.getElementById('main').getContext('2d');
	window.requestAnimationFrame(draw);
  }
}
init()
	  
function draw() {

	    ctx.clearRect(0, 0, 300, 375)
	    ctx.drawImage(line, 0 ,0 , 300 , 375);
	    ctx.drawImage(cloudl2, 0 ,0 , 300 , 375);
	    ctx.drawImage(cloudr2, 0 ,0 , 300 , 375);
	    ctx.drawImage(cloudl1, 0 ,0 , 300 , 375);
	    ctx.drawImage(cloudr1, 0 ,0 , 300 , 375);
	    show()
}

function show() {
	    let  i = 0;
	    let timer_cloud = setInterval( function(){

		  ctx.clearRect(0, 0, 300, 375)
	  	
 		  ctx.drawImage(line, 0 ,0 , 300 , 375);
	    	  ctx.drawImage(cloudl2, (-1)*i*2 ,0 , 300 , 375);
	    	  ctx.drawImage(cloudr2, i ,0 , 300 , 375);
	    	  ctx.drawImage(cloudl1, (-1)*i ,0 , 300 , 375);
	    	  ctx.drawImage(cloudr1, i*2 ,0 , 300 , 375);
		  if (i > 16) {
			 clearInterval(timer_cloud)
			 let j = 0.0
			 let timer_sun = setInterval( function() {
				ctx.globalAlpha = 0.0 + j;		
				ctx.drawImage(color, 0 ,0 , 300 , 375);
				ctx.globalAlpha = 1;		
 		  		ctx.drawImage(line, 0 ,0 , 300 , 375);
	    	  		ctx.drawImage(cloudl2, (-1)*i*2 ,0 , 300 , 375);
	    	  		ctx.drawImage(cloudr2, i ,0 , 300 , 375);
	    	  		ctx.drawImage(cloudl1, (-1)*i ,0 , 300 , 375);
	    	  		ctx.drawImage(cloudr1, i*2 ,0 , 300 , 375);
				j+=0.001
				if (j >= 1.0) {
					clearInterval(timer_sun)	
					ctx.drawImage(color, 0 ,0 , 300 , 375);
 		  			ctx.drawImage(line, 0 ,0 , 300 , 375);
	    	  			ctx.drawImage(cloudl2, (-1)*i*2 ,0 , 300 , 375);
	    	  			ctx.drawImage(cloudr2, i ,0 , 300 , 375);
	    	  			ctx.drawImage(cloudl1, (-1)*i ,0 , 300 , 375);
	    	  			ctx.drawImage(cloudr1, i*2 ,0 , 300 , 375);
				}
			 },25)
		  }else  i+=0.2 
	    },25)

}

//draw()
console.log("js")
