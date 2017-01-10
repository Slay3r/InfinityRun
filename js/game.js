/* todo: cleanup (dirty code),
 * 
 * Put static values / vars into initialization function
 * 
 * ---------------------------
 * Design / Graphics
 *
 * Parallax Background?
 *
 * ---------------------------
 * Menu
 * Menu draw in Input & draw prototypes
 * Handle / Manage CSS or HTML variables from JavaScript (Fullscreen,...)
 * ---------------------------
 *
 * Platform Schematic? - Schematic files?
 * Different Themes depending on Progress?
 * 
 * ---------------------------
 * Test-Phase
 * 
 * Controller: 'dragging' test Touch support
 * Browsertesting tools
 * eg.:
 * http://browserling.com/
 * http://browsershots.org/
 * https://crossbrowsertesting.com/
 * https://www.browserstack.com/
 */
//testweise rausgenommen verändert nix
//var i = 0; 

var debug = false;

var State = { Menu:0, Controlls:1,Started:2, Paused:3, Over:4 };
var GameState = State.Menu;
var MainMenu;
var MenuTab = {Main:0, Controlls:1,Settings:2, Highscore:3, Credits:4};
var curMenuTab = MenuTab.Main;

var vgaquality = 0; //0=low 1=mid 2=high
var settingsItem = 0; // 0=audiosettings 1= Graphicsettings 2= filtersettings
var setFilters = true; //set filter on or off

//timer
var s = 0,
ms = 0,
playTimer = false;

var highScore = new Array(10);
highScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//-------------------------------------------------------------
//vars background
var Tower, Street, dt, Town;
//Building

Town = [];

dt = 1;
 var jumpheight = 0
 //logoimage 
var bglogo = new Image();
bglogo.src = 'image/logo.png';
//-------------------------------------------------------------
var bgFX;
var sfx;

//playSound
function playMenuFX () {
	menuFX = createjs.Sound.play("MainMenu", {loop:-1});
}

function playbgFX (soundID) {
	bgFX = createjs.Sound.play(soundID, {loop:-1});
}


function playSFX (soundID) {
	sfx = createjs.Sound.play(soundID);
}

//-------------------------------------------------------------
          
// randomizer
function random(min, max) {
    return Math.round(min + (Math.random() * (max - min)));
}

function randomChoice(array) {
    return array[Math.round(random(0, array.length - 1))];
}


//initialize Sketch Framework
var InfinityRun = Sketch.create({
    fullscreen: true,
    width: 640,
    height: 360,
    container: document.getElementById('container')
});
var qs = document.querySelector('canvas');

//---------------------------------------------------------

//bg func
Tower = function(config) 
{
    	return this.reset(config);
};

Tower.prototype.reset = function(config) 
{
    	this.layer = config.layer;
    	this.x = config.x;
    	this.y = config.y;
    	this.width = config.width;
    	this.height = config.height;
    	this.color = config.color;
		this.summitTop = floor(random(0, 15)) === 0;
    	this.summitTopWidth = random(this.width * .01, this.width * .07);
    	this.summitTopHeight = random(10, 20);
    	this.singleroofTop = floor(random(0, 10)) === 0;
    	this.singleroofTopHeight = this.width / random(2, 4);
    	this.singleroofTopDirection = round(random(0, 1)) === 0;
		this.normalTop = !this.singleroofTop && floor(random(0, 10)) === 0;
    	this.normalTopHeight = this.width / random(2, 4);
    	this.normalTopchimney = round(random(0, 1)) === 0;
		this.coneTop = !this.singleroofTop && !this.normalTop && floor(random(0, 10)) === 0;
    	this.coneTopHeight = this.width / random(3, 4);
		this.coneTopWidth = this.width / random(1, 2);
    	this.coneTopeflat = round(random(0, 1)) === 0;
		this.companyTop = !this.singleroofTop && !this.summitTop && !this.radioTop && !this.normalTop && floor(random(0, 10)) === 0;
    	this.companyTopHeight = this.width / random(4, 6);
    	this.companyTopcount = 4;//round(random(3, 6));
    	this.radioTop = !this.summitTop && floor(random(0, 10)) === 0;
    	this.radioTopWidth = this.layer / 2;
    	return this.radioTopHeight = random(6, 30);
};

Tower.prototype.render = function() 
{
    	InfinityRun.fillStyle = InfinityRun.strokeStyle = this.color;
    	InfinityRun.lineWidth = 2;
    	InfinityRun.beginPath();
    	InfinityRun.rect(this.x, this.y, this.width, this.height);
    	InfinityRun.fill();
    	InfinityRun.stroke();
		
if (vgaquality > 0){ //graphics higher then low
    	if (this.singleroofTop) 
	{
      		InfinityRun.beginPath();
      		InfinityRun.moveTo(this.x, this.y);
      		InfinityRun.lineTo(this.x + this.width, this.y);
      		if (this.singleroofTopDirection) 
		{
        		InfinityRun.lineTo(this.x + this.width, this.y - this.singleroofTopHeight);
      		} 
		else 
		{
        		InfinityRun.lineTo(this.x, this.y - this.singleroofTopHeight);
      		}
      		InfinityRun.closePath();
      		InfinityRun.fill();
      		InfinityRun.stroke();
    	}

	if (this.normalTop) 
	{
	      	InfinityRun.beginPath();
      		InfinityRun.moveTo(this.x, this.y);
      		InfinityRun.lineTo(this.x + this.width, this.y);
			InfinityRun.lineTo(this.x + (this.width/2), this.y-this.normalTopHeight); 
      		InfinityRun.closePath();
      		InfinityRun.fill();
      		InfinityRun.stroke();
			if(this.normalTopchimney)
			{
				InfinityRun.beginPath();
				InfinityRun.moveTo(this.x+(this.width/5), this.y);
				InfinityRun.lineTo(this.x+(this.width/5), this.y- 0.8*(this.normalTopHeight));
				InfinityRun.lineTo(this.x + (this.width/5)+(this.width/10), this.y- 0.8*(this.normalTopHeight));
				InfinityRun.lineTo(this.x + (this.width/5)+(this.width/10), this.y); 
				InfinityRun.closePath();
				InfinityRun.fill();
				InfinityRun.stroke();	
			}
    	}
	if (vgaquality > 1 && this.coneTop) 
	{
	      	InfinityRun.beginPath();
      		InfinityRun.moveTo(this.x, this.y);
      		InfinityRun.lineTo(this.x + (this.width-this.coneTopWidth)/2, this.y-this.coneTopHeight);
			if(!this.coneTopeflat)
			{
				InfinityRun.lineTo(this.x+(this.width/2), this.y-(this.coneTopHeight*1.3));
			}
			InfinityRun.lineTo(this.x + ((this.width-this.coneTopWidth)/2)+this.coneTopWidth, this.y-this.coneTopHeight);
			InfinityRun.lineTo(this.x + this.width, this.y);
      		InfinityRun.closePath();
      		InfinityRun.fill();
      		InfinityRun.stroke();
			
    	}
	if (vgaquality > 1 && this.companyTop) 
	{
		var ctc = 1;
	  	while (ctc<=this.companyTopcount) 
		{
			InfinityRun.beginPath();
			InfinityRun.moveTo(this.x , this.y);
			InfinityRun.lineTo(this.x + ctc*(this.width/this.companyTopcount), this.y-this.companyTopHeight);
			InfinityRun.lineTo(this.x + ctc*(this.width/this.companyTopcount), this.y+this.companyTopHeight);
			InfinityRun.closePath();
			InfinityRun.fill();
			InfinityRun.stroke();
			ctc++;
	  	}
    	}
    	if (vgaquality > 1 && this.summitTop) 
	{
      		InfinityRun.beginPath();
      		InfinityRun.moveTo(this.x + (this.width / 2), this.y - this.summitTopHeight);
      		InfinityRun.lineTo(this.x + (this.width / 2) + this.summitTopWidth, this.y);
      		InfinityRun.lineTo(this.x + (this.width / 2) - this.summitTopWidth, this.y);
      		InfinityRun.closePath();
      		InfinityRun.fill();
      		InfinityRun.stroke();
    	}

    	if (vgaquality > 1 && this.radioTop) 
	{
      		InfinityRun.beginPath();
      		InfinityRun.moveTo(this.x + (this.width / 2), this.y - this.radioTopHeight);
      		InfinityRun.lineTo(this.x + (this.width / 2), this.y);
      		InfinityRun.lineWidth = this.radioTopWidth;
      		return InfinityRun.stroke();
    	}
}
};

Street = function(config) 
{
    	this.x = 0;
    	this.alltowers = [];
    	this.layer = config.layer;
    	this.width = {
      	min: config.width.min,
      	max: config.width.max
};

this.height = {
	min: config.height.min,
      	max: config.height.max
};

    this.speed = config.speed;
    this.color = config.color;
    this.populate();
    return this;
};

Street.prototype.populate = function() 
{
    	var newHeight, newWidth, results, totalWidth;
    	totalWidth = 0;
    	results = [];
    	while (totalWidth <= InfinityRun.width + (this.width.max * 2)) 
	{
      		newWidth = round(random(this.width.min, this.width.max));
      		newHeight = round(random(this.height.min, this.height.max));
      		this.alltowers.push(new Tower({
        	layer: this.layer,
        	x: this.alltowers.length === 0 ? 0 : this.alltowers[this.alltowers.length - 1].x + this.alltowers[this.alltowers.length - 1].width,
        	y: InfinityRun.height - newHeight,
        	width: newWidth,
        	height: newHeight,
        	color: this.color
      		}));
      		results.push(totalWidth += newWidth);
    	}
    	return results;
};

Street.prototype.update = function() 
{
	var firstTower, lastTower, newHeight, newWidth;
	if (InfinityRun.accelerationTweening==0)
	{
		this.x-=((150) * this.speed) * dt;
	}
	else
	{
    this.x -= ((InfinityRun.accelerationTweening*330) * this.speed) * dt;
	}

    	firstTower = this.alltowers[0];
    	if (firstTower.width + firstTower.x + this.x < 0) 
	{
      		newWidth = round(random(this.width.min, this.width.max));
      		newHeight = round(random(this.height.min, this.height.max));
      		lastTower = this.alltowers[this.alltowers.length - 1];
      		firstTower.reset({
        		layer: this.layer,
        		x: lastTower.x + lastTower.width,
        		y: InfinityRun.height - newHeight,
        		width: newWidth,
        		height: newHeight,
        		color: this.color
      		});
      	return this.alltowers.push(this.alltowers.shift());
    	}
};

Street.prototype.render = function() 
{
	var i;
    	i = this.alltowers.length;
    	InfinityRun.save();
		InfinityRun.translate(this.x, (InfinityRun.height - (InfinityRun.height-(-jumpheight*0.5)-400)) / 20 * this.layer);
    	
		while (i--) {
      		this.alltowers[i].render(i);
    	}
    	return InfinityRun.restore();
};
//---------------------------------------------------------
//------- Vector [Get/Set] Functions ---------

//Set X,Y,Width,Height
function Vector2(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.previousX = 0;
    this.previousY = 0;
};


// Set X,Y
Vector2.prototype.setPosition = function(x, y) {

    this.previousX = this.x;
    this.previousY = this.y;

    this.x = x;
    this.y = y;

};
// Set X
Vector2.prototype.setX = function(x) {

    this.previousX = this.x;
    this.x = x;

};

// Set Y
Vector2.prototype.setY = function(y) {

    this.previousY = this.y;
    this.y = y;

};

// Collision / Intersection Top
Vector2.prototype.intersects = function(obj) {

    if (obj.x < this.x + this.width && obj.y < this.y + this.height &&
        obj.x + obj.width > this.x && obj.y + obj.height > this.y) {
        return true;
    }

    return false;
};

// Collision / Intersection Left
Vector2.prototype.intersectsLeft = function(obj) {

    if (obj.x < this.x + this.width && obj.y < this.y + this.height) {
        return true;
    }

    return false;
};

//--------- Player ---------

function Player(options) {

    this.setPosition(options.x, options.y);
    this.width = options.width;
    this.height = options.height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.jumpSize = -13;
    this.color = '#181818';

}

Player.prototype = new Vector2;

Player.prototype.update = function() {
    // Gravity 
    this.velocityY += 1;
	//um bg zu ändern
	jumpheight=(this.y);
    this.setPosition(this.x + this.velocityX, this.y + this.velocityY);

    if (this.y > InfinityRun.height || this.x + this.width < 0) {
        this.x = 150;
        this.y = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        InfinityRun.jumpCount = 0;
        InfinityRun.acceleration = 0;
        InfinityRun.accelerationTweening = 0;
        InfinityRun.scoreColor = '#181818';
        InfinityRun.platformManager.maxDistanceBetween = 350;
		
		//InfinityRun.pause();
		
		//highscore update-----------------------------------------------
		if (timePassed>highScore[0]){
			var help =highScore[0];
			var help2=highScore[1];
			highScore[0]=timePassed;
			for(i=1; i<=9;i++){
			help2 = highScore[i];
			highScore[i]=help;
			help=help2;
			
			}
			
		}
        InfinityRun.platformManager.updateWhenLose();
	
		playSFX("Crash");
		bgFX.stop();
		difficulty = 0;
		ms = 0;
    }

    if ((InfinityRun.keys.UP || InfinityRun.keys.SPACE || InfinityRun.keys.W || InfinityRun.dragging) && this.velocityY < -8) {
        this.velocityY += -0.75;
		
    }
	
	
    if (InfinityRun.keys.DOWN) {
        this.velocityY += 1;
    }

};

Player.prototype.draw = function() {
    InfinityRun.fillStyle = this.color;
    InfinityRun.fillRect(this.x, this.y, this.width, this.height);
};

// --------- Platforms ---------

function Platform(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.previousX = 0;
    this.previousY = 0;
    this.color = options.color;
}

Platform.prototype = new Vector2;

Platform.prototype.draw = function() {
    InfinityRun.fillStyle = this.color;
    InfinityRun.fillRect(this.x, this.y, this.width, this.height);
};

// --------- Platform Manager ---------

function PlatformManager() {
    this.maxDistanceBetween = 300;
	this.colors = ['#3D494F'];

	//first 3 Platforms execept the Starter Platform
    this.first = new Platform({
        x: 300,
        y: 600,
        width: 400,
        height: 70
    })
    this.second = new Platform({
        x: (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
        y: 570,//y: random(this.first.y - 128, InfinityRun.height - 80),
        width: 400,
        height: 70
    })
    this.third = new Platform({
        x: (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
        y: 540,//y: random(this.second.y - 128, InfinityRun.height - 80),
        width: 400,
        height: 70
    })

    this.first.height = this.first.y + InfinityRun.height;
    this.second.height = this.second.y + InfinityRun.height;
    this.third.height = this.third.y + InfinityRun.height;
    this.first.color = randomChoice(this.colors);
    this.second.color = randomChoice(this.colors);
    this.third.color = randomChoice(this.colors);

    this.colliding = false;

    this.platforms = [this.first, this.second, this.third];
}

PlatformManager.prototype.update = function() {

    this.first.x -= 3 + InfinityRun.acceleration;
    if (this.first.x + this.first.width < 0) {
        this.first.width = random(450, 800);
        this.first.x = (this.third.x + this.third.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
        //this.first.y = random(this.third.y - 32, InfinityRun.height - 80);
		this.first.y = random(this.third.y - 32, InfinityRun.height - 200);
        this.first.height = this.first.y + InfinityRun.height + 10;
        this.first.color = randomChoice(this.colors);
    }

    this.second.x -= 3 + InfinityRun.acceleration;
    if (this.second.x + this.second.width < 0) {
        this.second.width = random(450, 800);
        this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
		//this.first.y = random(this.third.y - 32, InfinityRun.height - 80);
        this.second.y = random(this.first.y - 32, InfinityRun.height - 200);
        this.second.height = this.second.y + InfinityRun.height + 10;
        this.second.color = randomChoice(this.colors);
    }

    this.third.x -= 3 + InfinityRun.acceleration;
    if (this.third.x + this.third.width < 0) {
        this.third.width = random(450, 800);
        this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
		//this.first.y = random(this.third.y - 32, InfinityRun.height - 80);
        this.third.y = random(this.second.y - 32, InfinityRun.height - 200);
        this.third.height = this.third.y + InfinityRun.height + 10;
        this.third.color = randomChoice(this.colors);
    }

};



// reset / new Game: set Starting Platform Parameters
PlatformManager.prototype.updateWhenLose = function() {

    this.first.x = 300;
    this.first.color = randomChoice(this.colors);
	this.first.y = 500;
    //this.first.y = InfinityRun.width / random(2, 3);
    this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
    this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);

};

// --------- Particle System --------- (Sketch Docs)

function Particle(options) {
    this.x = options.x;
    this.y = options.y;
    this.size = 10;
    this.velocityX = options.velocityX || random(-(InfinityRun.acceleration * 3) + -8, -(InfinityRun.acceleration * 3));
    this.velocityY = options.velocityY || random(-(InfinityRun.acceleration * 3) + -8, -(InfinityRun.acceleration * 3));
    this.color = options.color;
}

Particle.prototype.update = function() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.size *= 0.89;
};

Particle.prototype.draw = function() {
    InfinityRun.fillStyle = this.color;
    InfinityRun.fillRect(this.x, this.y, this.size, this.size);
};

/************************************************/


InfinityRun.setup = function() {

    this.jumpCount = 0;
    this.acceleration = 0;
    this.accelerationTweening = 0;
    this.player = new Player({
        x: 150,
        y: 30,
        width: 32,
        height: 32
    });

	setTimeout(function (){
	playMenuFX("MainMenu");

	}, 100); 
	

    this.platformManager = new PlatformManager();

    this.particles = [];
    this.particlesIndex = 0;
    this.particlesMax = 20;
    this.collidedPlatform = null;
    this.scoreColor = '#181818';
    this.jumpCountRecord = 0;
	//--------------------------------------
    var i, results;
    i = 3;
    results = [];
    while (i--) {
      results.push(Town.push(new Street({
        layer: i + 1,
        width: {
          min: (i + 1) * 20,
          max: (i + 1) * 50
        },
        height: {
          min: InfinityRun.height-200 - (i * round(InfinityRun.height/3)),
          max: InfinityRun.height-50 - (i * round(InfinityRun.height/3))
        },
        speed: (i + 1) * .003,
        color: 'hsl( 200, ' + (((i + 1) * 1) + 10) + '%, ' + (75 - (i * 13)) + '% )'
      })));
    }
	return results;
	//--------------------------------------
	

};
//--------------------------------------------
InfinityRun.clear = function() {
    return InfinityRun.clearRect(0, 0, InfinityRun.width, InfinityRun.height);
  };
//--------------------------------------------

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

var sc = 0;
var sx = 0;
var sy = 0;
var sz = 0;
var invertRunning = false;
var sunsetRunning = false;
timer = setInterval(function() {
  if (!playTimer) return;
    ms += 1;
	sc += 1;
	sy += 1;
	sz += 1;
	if (sc == 99) {
		s+=1;
		sx+=1;
		sc = 0;
	}
	
	updateTimer();

}, 1);

function randomIntFromInterval(min,max)
{
	var milliseconds = new Date().getMilliseconds();
    return Math.floor(Math.random()*(max-min+1)+min);
}


var rng = random(115,124);
var rng2 = random(13,16)
function updateTimer() {
  if (s==rng) {
	  if(!invertRunning) {
	  invertRunning = true;
	  rng = random(30,50);
	  if(setFilters) //toggle filters
	  {
	      qs.classList.toggle('invertFilter');
	  }
	  }
	  s=0;
  }
  if (sx==rng2) {
	  if(!sunsetRunning) {
	  sunsetRunning = true;
	  rng2 = random(2,5);
	  if(setFilters) //toggle filters
	  {
	      qs.classList.toggle('sunsetFilter');
	  }
	  }
      sx=0;
  }
  if (sz==70) {
	  invertRunning = false;
	  sz = 0;
  }
  if (sy==70) {
	  invertRunning = false;
	  sy = 0;
  }
  

	timePassed = ms;
}

function toggleTimer() {
  if (!playTimer) {
    //s = 0, ms = 0;

    updateTimer();
  }
  playTimer = !playTimer;
}

var difficulty = 0;

InfinityRun.update = function() {	
	if (GameState == State.Started) {
	//--------------------------------------------
	//clear func bg
	
	var i, results;
    dt = InfinityRun.dt < .1 ? .1 : InfinityRun.dt / 16;
    dt = dt > 5 ? 5 : dt;
    i = Town.length;
    results = [];
    while (i--) {
      results.push(Town[i].update(i));
    }
	//--------------------------------------------

	if(document.hasFocus()) {
		toggleTimer();
	} else {
		toggleTimer();
	}
	
	
    this.player.update();
    restartAudio();	
	if(difficulty ==0) {
		
		playbgFX("Main1");
		difficulty = 1;
	} else if (timePassed>1000 && timePassed < 5000 && difficulty == 1) {
		this.accelerationTweening = 1.5;
        this.platformManager.maxDistanceBetween = 430;

		bgFX.stop();
		playbgFX("Main2");
		playSFX("LevelUP");
		
		difficulty = 2;
	} else if (timePassed>5000 && timePassed < 10000 && difficulty == 2) {
		this.accelerationTweening = 2.7;
        this.platformManager.maxDistanceBetween = 530;

		
		bgFX.stop();
		playbgFX("Main3");
		playSFX("LevelUP");
		
		difficulty = 3; 
	} else if (timePassed>10000 && timePassed < 15000 && difficulty == 3) {
		this.accelerationTweening = 3.8;
        this.platformManager.maxDistanceBetween = 580;

		
		bgFX.stop();
		playbgFX("Main4");
		playSFX("LevelUP");

		difficulty = 4;
	} else if (timePassed>15000 && timePassed < 20000 && difficulty == 4) {
		this.accelerationTweening = 4.4;
		this.PlatformManager.maxDistanceBetween = 610;
		
		
		playSFX("LevelUP");
		
		difficulty = 5;
	} else if (timePassed>20000 && difficulty == 5) {
		this.accelerationTweening = 5;
		this.PlatformManager.maxDistanceBetween = 620;

		
		playSFX("LevelUP");
		
		difficulty = 6;
	}
    this.acceleration += (this.accelerationTweening - this.acceleration) * 0.01;

    for (i = 0; i < this.platformManager.platforms.length; i++) {
        if (this.player.intersects(this.platformManager.platforms[i])) {
            this.collidedPlatform = this.platformManager.platforms[i];
            if (this.player.y < this.platformManager.platforms[i].y) {
                this.player.y = this.platformManager.platforms[i].y;

                // Gravity after Collision with Platform
                this.player.velocityY = 0;
            }

            this.player.x = this.player.previousX;
            this.player.y = this.player.previousY;

            this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle({
                x: this.player.x,
                y: this.player.y + this.player.height,
                color: this.collidedPlatform.color
            });

            if (this.player.intersectsLeft(this.platformManager.platforms[i])) {
                this.player.x = this.collidedPlatform.x - 64;
                for (i = 0; i < 10; i++) {
                    // SpawnParticles @PlayerPostion with intersecting Platform Color
                    this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle({
                        x: this.player.x + this.player.width,
                        y: random(this.player.y, this.player.y + this.player.height),
                        velocityY: random(-30, 30),
                        color: randomChoice(['#181818', '#181818', this.collidedPlatform.color])
                    });
                };

                // bounce player / push him away (effect)
                this.player.velocityY = -10 + -(this.acceleration * 4);
                this.player.velocityX = -20 + -(this.acceleration * 4);

				if (timePassed > this.jumpCountRecord) {
                        this.jumpCountRecord = timePassed;
                }	
            } else {

                // --------- Controller ---------
                // dragging: Mouse click & touch support 
                if (this.dragging || this.keys.SPACE || this.keys.UP || this.keys.W) {
                    this.player.velocityY = this.player.jumpSize;
                    this.jumpCount++;
					
					playSFX("Jump");
                }
            }
        }
    };

    for (i = 0; i < this.platformManager.platforms.length; i++) {
        this.platformManager.update();
    };

    for (i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
    };
	//-----------------------------------------------
	//bg 
	return results;
	//-----------------------------------------------
}

};




var selectedItem = 0;
var audioItem = 10;


InfinityRun.keydown = function() {
    if (InfinityRun.keys.ESCAPE && GameState==State.Started) {
		InfinityRun.clear();
		GameState = State.Menu;

		bgFX.setPaused(true);
		//playMenuFX("MainMenu");
		menuFX.setPaused(false);
		toggleTimer();
		
	} else if (InfinityRun.keys.ESCAPE && GameState==State.Menu && curMenuTab==MenuTab.Main) {
		GameState = State.Started;
		toggleTimer();
		//menuFX.stop();
		bgFX.setPaused(false);
		menuFX.setPaused(true);

		
		
	}else if (InfinityRun.keys.ESCAPE && GameState==State.Menu && curMenuTab==MenuTab.Controlls) {
		curMenuTab = MenuTab.Main;
    }else if (InfinityRun.keys.ESCAPE && GameState==State.Menu && curMenuTab==MenuTab.Settings) {
		curMenuTab = MenuTab.Main;
	} else if (InfinityRun.keys.ESCAPE && GameState==State.Menu && curMenuTab==MenuTab.Highscore) {
		curMenuTab = MenuTab.Main;
	} else if (InfinityRun.keys.ESCAPE && GameState==State.Menu && curMenuTab==MenuTab.Credits) {
		curMenuTab = MenuTab.Main;
	}
	
	//main menu controls
	if (InfinityRun.keys.UP && GameState == State.Menu) {
		selectedItem = (selectedItem + items.length - 1) % items.length;
	}
	if (InfinityRun.keys.DOWN && GameState == State.Menu) {
		selectedItem = (selectedItem + 1) % items.length;
	}
	//general settings choose
	if (InfinityRun.keys.UP && curMenuTab==MenuTab.Settings && settingsItem!=0) {
		settingsItem-=1;
	}
	if (InfinityRun.keys.DOWN && curMenuTab==MenuTab.Settings && settingsItem!=2) {
		settingsItem+=1;
	}
	// settings audio change
	if (InfinityRun.keys.LEFT && curMenuTab==MenuTab.Settings && audioItem !=0 && settingsItem ==0) {
		audioItem = (audioItem + items.length - 1) % items.length;
		createjs.Sound.volume -= 0.1;
	}
	
	if (InfinityRun.keys.RIGHT && curMenuTab==MenuTab.Settings && audioItem !=10 && settingsItem ==0) {
		audioItem = (audioItem + 1) % items.length;
		createjs.Sound.volume += 0.1;
	}
	//graphic settings change
	if (InfinityRun.keys.LEFT && curMenuTab==MenuTab.Settings && vgaquality!=0 && settingsItem ==1) {
		vgaquality-=1;
	}
	
	if (InfinityRun.keys.RIGHT && curMenuTab==MenuTab.Settings && vgaquality!=2 && settingsItem ==1) {
		vgaquality+=1;
	}
	//filter settings change
	if (InfinityRun.keys.LEFT && curMenuTab==MenuTab.Settings && !setFilters && settingsItem ==2) {
		setFilters=true;
	}
	
	if (InfinityRun.keys.RIGHT && curMenuTab==MenuTab.Settings && setFilters && settingsItem ==2) {
		setFilters=false;
		if (invertRunning) {
			qs.classList.toggle('invertFilter');
		}
		if (sunsetRunning) {
			qs.classList.toggle('sunsetFilter');
		}
	}
	if(InfinityRun.keys.ENTER && GameState == State.Menu) {
		callback(selectedItem);
	}
	
}

Menu = function() {
}


//--------- Draw ---------


InfinityRun.draw = function() {
	
	if(GameState == State.Started) {
	//----------------------------------------------------------------
	//bg draw
	
	var i, results;
    i = Town.length;
    results = [];
	if(vgaquality>1){
    while (i--) {
            results.push(Town[i].render(i));
		
    }
	}
    if (vgaquality==1)
	{
    i-=1; //only upper towers will be drawn
	while (i--) {
            results.push(Town[i+1].render(i+1));
		
    }
	}
    if (vgaquality<1)
	{
    i-=2; //only one street will be drawn
	while (i--) {
            results.push(Town[i+1].render(i+1));
		
    }
	
	}	
	//----------------------------------------------------------------
	
    this.player.draw();

    for (i = 0; i < this.platformManager.platforms.length; i++) {
        this.platformManager.platforms[i].draw();
    };

    //Draw particles
    for (i = 0; i < this.particles.length; i++) {
        this.particles[i].draw();
    };
	
	//draw score
	this.font = '30pt Bungee';
	this.textAlign="left";
	this.fillStyle = '#494949';
	this.fillText('Score: ', this.width - 330, 65);
	this.fillText(timePassed , this.width - 170, 65);
	
	/*
	 * Main Menu
	 *
	 */
	} else if (GameState == State.Menu && curMenuTab==MenuTab.Main) {
	
	this.title = "InfinityRun";
	items = ["Play","Controls", "Settings", "Highscore", "Credits"];
	
	callback = function(numItem) { //if (numItem == 0) GameState=State.Started 
	
	switch (numItem) {
	  case 0:
		GameState=State.Started;
		toggleTimer();
		//bgFX.stop();
		menuFX.setPaused(true);
		break;
	  case 1:
	    curMenuTab=MenuTab.Controlls;
	    break;
	  case 2:
		curMenuTab=MenuTab.Settings;
		break;
	  case 3:
	    curMenuTab=MenuTab.Highscore;
		break;
	  case 4:
	    curMenuTab=MenuTab.Credits;
		break;
	  
	}
	
	
	
	};
	this.height = InfinityRun.height;
	this.width = InfinityRun.width;
	this.size = 70;	
	
	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height)
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var height = 100;
	//logo
	this.drawImage(bglogo,this.width-500,this.height-300);
	//-------------------------------
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Bungee";
		this.fillText(this.title, this.width/2, height);
		height+= height;
	}
	
	for (var i = 0; i < items.length; ++i)
	{
		var size = Math.floor(this.size*0.8);
		if (i == selectedItem)
		{
			this.fillStyle = "#A9F5F2";
			size = this.size+5;
		}
		this.font = size.toString() + "px Bungee";
		height += this.size;
		this.fillText(items[i], InfinityRun.width/2, height);
		this.fillStyle = "White";
	}
	//----------------------------------------------------------- 
	//bg dd <-- ??
	return results;
	//-----------------------------------------------------------
	
	/*
	 * Settings Tab
	 *
	 */
	}else if (GameState == State.Menu && curMenuTab==MenuTab.Controlls){ 
		this.title = "Controlls";
	items = highScore;
	

	callback = function(volume) { //if (numItem == 0) GameState=State.Started 
	
	switch (volume) {

	}
	
	
	
	};
	this.height = InfinityRun.height;
	this.width = InfinityRun.width;

	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height, items[i]);
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var width = 10;
	var height = 150;
	
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Bungee";
		this.fillText(this.title, this.width/2, 150);
		height+= height;
	}
	var distanceText = 50
	this.font = Math.floor(40).toString() + "px Bungee";
	this.textAlign = "left";
	//Names
	this.fillText("Menu:", this.width/5, 300);
	this.font = Math.floor(20).toString() + "px Bungee";
	this.fillText("[ESC] - Menu", this.width/5, 300+distanceText);
	this.fillText("[Arrow up/down] - To navigate", this.width/5, 300+2*distanceText);
	this.fillText("[Enter] - Accept", this.width/5, 300+3*distanceText);

	this.font = Math.floor(40).toString() + "px Bungee";
	this.textAlign = "left";
	//Names
	this.fillText("Game:", this.width/5, 300+5*distanceText);
	this.font = Math.floor(20).toString() + "px Bungee";
	this.fillText("[ESC] - Menu", this.width/5, 300+6*distanceText);
	this.fillText("[W], [Arrow up], [Leertaste] - Jump", this.width/5, 300+7*distanceText);
	this.fillText("[Arrow down ] - increase falling speed", this.width/5, 300+8*distanceText);
	}
	else if (GameState == State.Menu && curMenuTab==MenuTab.Settings){
		
	this.title = "Settings";
	items = [0,10, 20, 30, 40, 50, 60, 70, 80, 90 , 100];
	
	callback = function(volume) { //if (numItem == 0) GameState=State.Started 
	
	switch (volume) {

	}
	
	
	
	};

	this.height = InfinityRun.height;
	this.width = InfinityRun.width;

	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height, items[i]);
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var width = 10;
	var height = 10;
	var posx = 130;
	var posy = 380;
	this.space = 15;	
	this.heightincr = 4;
	
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Bungee";
		this.fillText(this.title, this.width/2, 150);
		height+= height;
	}
	
	this.font = "55px Bungee";
	if (settingsItem==0) {
	this.fillStyle = "#A9F5F2";
	}
	this.fillText('Volume', 240, 300);
	
	this.fillStyle = "White";

	
	for (var i = 0; i < items.length; ++i) {
		var size = Math.floor(this.size*0.8);
		if (i == audioItem && settingsItem==0)
		{
			this.fillStyle = "#A9F5F2";
			//size = this.size+5;
		}
		this.font = size.toString() + "px Bungee";
		posx += this.space;
		posy -= this.heightincr;
		height += this.heightincr;
		
		items[i] = this.fillRect(posx,posy,width,height);
		
		//this.fillText(items[i], InfinityRun.width/2, height);
		this.fillStyle = "White";
		
	}
	//------------------------------------------------------------------------------------
	//Graphic Settings
	this.fillStyle = "White";
	if (settingsItem==1) {
	this.fillStyle = "#A9F5F2";
	}
	this.fillText('Graphics', 240, 500);
	this.fillStyle = "White";
	switch (vgaquality) {
		//Low
	  case 0:
	    this.fillText('Mid', 500,600 );
		this.fillText('High', 700, 600);
		if (settingsItem == 1){
		this.fillStyle = "#A9F5F2";
		}
		this.fillText('Low', 240, 600);
		break;
		//mid
	  case 1:
	  
		this.fillText('Low', 240, 600);
		this.fillText('High', 700, 600);
		if (settingsItem == 1){
		this.fillStyle = "#A9F5F2";
		}
		this.fillText('Mid', 500,600 );
		
	    break;
		//high
	  case 2:
	    this.fillText('Mid', 500,600 );
		this.fillText('Low', 240, 600);
		if (settingsItem == 1){
		this.fillStyle = "#A9F5F2";
		}
		this.fillText('High', 700, 600);
		
		break;
	  
	}
	//-----------------------------------------------------------------------------------
	//Filter settings
	this.fillStyle = "White";
	if (settingsItem==2) {
	this.fillStyle = "#A9F5F2";
	}
	this.fillText('Filters', InfinityRun.width-300, 300);
	this.fillStyle = "White";
	if(setFilters)
	{
	   this.fillText('Off', InfinityRun.width-200, 400);
	   if (settingsItem==2)
	   {
           this.fillStyle = "#A9F5F2";
	   }
       this.fillText('On', InfinityRun.width-350, 400);	   
	}
	else
	{
	   this.fillText('On', InfinityRun.width-350, 400);
       if (settingsItem==2)
	   {
           this.fillStyle = "#A9F5F2";
	   }
       this.fillText('Off', InfinityRun.width-200, 400);
	}
	
	//------------------------------------------------------------------------------------
	/*
	 * Highscore Tab
	 *
	 */
	
	} else if (GameState == State.Menu && curMenuTab == MenuTab.Highscore) {
	
	
	this.title = "Highscore";
	items = highScore;
	

	callback = function(volume) { //if (numItem == 0) GameState=State.Started 
	
	switch (volume) {

	}
	
	
	
	};
	this.height = InfinityRun.height;
	this.width = InfinityRun.width;

	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height, items[i]);
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var width = 10;
	var height = 100;
	
	
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Bungee";
		this.fillText(this.title, this.width/2, 150);
		height+= height;
	}
	
	var rank = 1;
		
	for (var i = 0; i < items.length; ++i)
	{
		
		var size = Math.floor(this.size*0.8);
		if (i == selectedItem)
		{
			this.fillStyle = "#A9F5F2";
			size = this.size+5;
		}
		this.font = 0.6*size.toString() + "px Bungee";
		height += 50;
		this.fillText(rank + ". " + items[i], InfinityRun.width/2, height);
		this.fillStyle = "White";
		
		rank++;
	}
	
	}
    // Credits Menu----------------------------------------------------------	
	else if (GameState == State.Menu && curMenuTab == MenuTab.Credits) {
	
	this.title = "Credits";
	items = highScore;

	callback = function(volume) { //if (numItem == 0) GameState=State.Started 
	
	switch (volume) {

	}
	
	
	
	};
	this.height = InfinityRun.height;
	this.width = InfinityRun.width;

	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height, items[i]);
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var width = 10;
	var height = 150;
	
	
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Bungee";
		this.fillText(this.title, this.width/2, 150);
		height+= height;
	}
	var distanceText = 50
	this.font = Math.floor(50).toString() + "px Bungee";
	this.textAlign = "left";
	//Names
	this.fillText("Group Members:", this.width/5, 300);
	this.font = Math.floor(40).toString() + "px Bungee";
	this.fillText("  Florian Durli", this.width/5, 300+distanceText);
	this.fillText("  Koray Emtekin", this.width/5, 300+2*distanceText);
	this.fillText("  Jannik Ivosevic", this.width/5, 300+3*distanceText);
	this.fillText("  Marco Mayer", this.width/5, 300+4*distanceText);
	this.fillText("  Johannes But", this.width/5, 300+5*distanceText);
	//bottom info
	this.font = Math.floor(15).toString() + "px Times New Roman";
	this.textAlign = "center";
	distanceText = 20;
	this.fillText("InfinityRun is a nonprofit students project at \"Hochschule Furtwangen\"/\"Furtwangen University.\" Special thanks to \"Soulwire\" for his Sketch.js Minimal JavaScript Creative Coding Framework",this.width/2, this.height-2.2*distanceText);
	this.fillText("Sounds: freesounds.org Special thanks to Jack Rugil for his Parrallax Skyline",this.width/2, this.height-distanceText-5);
	this.fillText("2016",this.width/2, this.height-8);
	
	
	}
	
    //Debug
    if (debug) {
        this.font = '16pt Arial';
        this.fillStyle = '#181818';
        this.fillText('Record: ' + s + " " + sc/*this.jumpCountRecord*/, this.width - 150, 33);
        this.fillStyle = this.scoreColor;
        this.fillText('Jumps: ' + this.jumpCount, this.width - 150, 50);
    }
	
};

InfinityRun.resize = function() {
    /* todo Windowscale optimization
     *
     *
     */
}
