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
var i = 0;

var State = { Menu:0, Started:1, Paused:2, Over:3 };
var GameState = State.Menu;
var MainMenu;

var debug = true;
var bgaudio = document.getElementById('backgroundmusic');
var fxaudio = document.getElementById('fxaudio');
var backgroundaudio = "sounds/main1.wav";
        function playAudio() {
            // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                     
                        bgaudio.src = backgroundaudio;
                        //currentFile = audioURL.value;                       
                    //}

                    // Tests the paused attribute and set state. 
                    if (bgaudio.paused) {
                        bgaudio.play();
                        //btn.textContent = "Pause";
                    }
                    else {
                        bgaudio.pause();
                        //btn.textContent = "Play";
                    }
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                   if(window.console && console.error("Error:" + e));
                }
            }
        }
		function restartAudio() {
            // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                     
                        
                    // Tests the paused attribute and set state. 
                    if (bgaudio.ended) {
						bgaudio.currentTime = 0;
                        bgaudio.play();
                        //btn.textContent = "Pause";
                    }
                    
                    
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                   if(window.console && console.error("Error:" + e));
                }
            }
        }
		
		
             // Rewinds the audio file by 30 seconds.

        //function rewindAudio() {
             // Check for audio element support.
          //  if (window.HTMLAudioElement) {
            //    try {
              //      var oAudio = document.getElementById('myaudio');
                //    oAudio.currentTime -= 30.0;
                //}
                //catch (e) {
                    // Fail silently but show in F12 developer tools console
                  //   if(window.console && console.error("Error:" + e));
                //}
            //}
        //}

             // Fast forwards the audio file by 30 seconds.

        //function forwardAudio() {

             // Check for audio element support.
          //  if (window.HTMLAudioElement) {
            //    try {
              //      var oAudio = document.getElementById('myaudio');
                //    oAudio.currentTime += 30.0;
                //}
                //catch (e) {
                    // Fail silently but show in F12 developer tools console
                  //   if(window.console && console.error("Error:" + e));
                //}
            //}
        //}

             // Restart the audio file to the beginning.

        //function restartAudio() {
             // Check for audio element support.
           // if (window.HTMLAudioElement) {
             //   try {
               //     var oAudio = document.getElementById('myaudio');
               //     oAudio.currentTime = 0;
              //  }
               // catch (e) {
                    // Fail silently but show in F12 developer tools console
                //     if(window.console && console.error("Error:" + e));
             //  }
           // }
       // }
          
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
        InfinityRun.platformManager.updateWhenLose();
		fxaudio.pause();
	    fxaudio.src = 'sounds/crash.wav';
	    fxaudio.load();
	    fxaudio.play();
		
    }

    if ((InfinityRun.keys.UP || InfinityRun.keys.SPACE || InfinityRun.keys.W || InfinityRun.dragging) && this.velocityY < -8) {
        this.velocityY += -0.75;
    }
	if ((InfinityRun.keys.UP || InfinityRun.keys.SPACE || InfinityRun.keys.W || InfinityRun.dragging) && this.velocityY >0) {
        fxaudio.pause();
	    fxaudio.src = 'sounds/jump.wav';
	    fxaudio.load();
	    fxaudio.play();
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
    this.colors = ['#2ca8c2', '#98cb4a', '#f76d3c', '#f15f74', '#5481e6'];

	
	//first 3 Platforms execept the Starter Platform
    this.first = new Platform({
        x: 300,
        y: InfinityRun.width / 2,
        width: 400,
        height: 70
    })
    this.second = new Platform({
        x: (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
        y: random(this.first.y - 128, InfinityRun.height - 80),
        width: 400,
        height: 70
    })
    this.third = new Platform({
        x: (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
        y: random(this.second.y - 128, InfinityRun.height - 80),
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
        this.first.width = random(450, InfinityRun.width + 200);
        this.first.x = (this.third.x + this.third.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
        this.first.y = random(this.third.y - 32, InfinityRun.height - 80);
        this.first.height = this.first.y + InfinityRun.height + 10;
        this.first.color = randomChoice(this.colors);
    }

    this.second.x -= 3 + InfinityRun.acceleration;
    if (this.second.x + this.second.width < 0) {
        this.second.width = random(450, InfinityRun.width + 200);
        this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
        this.second.y = random(this.first.y - 32, InfinityRun.height - 80);
        this.second.height = this.second.y + InfinityRun.height + 10;
        this.second.color = randomChoice(this.colors);
    }

    this.third.x -= 3 + InfinityRun.acceleration;
    if (this.third.x + this.third.width < 0) {
        this.third.width = random(450, InfinityRun.width + 200);
        this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
        this.third.y = random(this.second.y - 32, InfinityRun.height - 80);
        this.third.height = this.third.y + InfinityRun.height + 10;
        this.third.color = randomChoice(this.colors);
    }

};



// reset / new Game: set Starting Platform Parameters
PlatformManager.prototype.updateWhenLose = function() {

    this.first.x = 300;
    this.first.color = randomChoice(this.colors);
    this.first.y = InfinityRun.width / random(2, 3);
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
	bgaudio.pause();
	bgaudio.src = 'sounds/menu.wav';
	bgaudio.load();
	bgaudio.play();

    this.platformManager = new PlatformManager();

    this.particles = [];
    this.particlesIndex = 0;
    this.particlesMax = 20;
    this.collidedPlatform = null;
    this.scoreColor = '#181818';
    this.jumpCountRecord = 0;

};


InfinityRun.update = function() {	
	if (GameState == State.Started) {
    this.player.update();
    restartAudio();	
    switch (this.jumpCount) {
		case 0:
			bgaudio.pause();
			bgaudio.src = 'sounds/main1.wav';
			bgaudio.load();
			bgaudio.play();
            break;
        case 10:
            this.accelerationTweening = 1;
            this.platformManager.maxDistanceBetween = 430;
            //this.scoreColor = '#076C00';
			bgaudio.pause();
			bgaudio.src = 'sounds/main2.wav';
			bgaudio.load();
			bgaudio.play();
			fxaudio.pause();
			fxaudio.src = 'sounds/levelup.wav';
			fxaudio.load();
			fxaudio.play();
            break;
        case 25:
            this.accelerationTweening = 2;
            this.platformManager.maxDistanceBetween = 530;
            //this.scoreColor = '#0300A9';
			bgaudio.pause();
			bgaudio.src = 'sounds/main3.wav';
			bgaudio.load();
			bgaudio.play();
			fxaudio.pause();
			fxaudio.src = 'sounds/levelup.wav';
			fxaudio.load();
			fxaudio.play();
            break;
        case 40:
            this.accelerationTweening = 3;
            this.platformManager.maxDistanceBetween = 580;
            //this.scoreColor = '#9F8F00';
			bgaudio.pause();
			bgaudio.src = 'sounds/main4.wav';
			bgaudio.load();
			bgaudio.play();
			fxaudio.pause();
			fxaudio.src = 'sounds/levelup.wav';
			fxaudio.load();
			fxaudio.play();
            break;
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
            } else {

                // --------- Controller ---------
                // dragging: Mouse click & touch support 
                if (this.dragging || this.keys.SPACE || this.keys.UP || this.keys.W) {
                    this.player.velocityY = this.player.jumpSize;
                    this.jumpCount++;
					
                    if (this.jumpCount > this.jumpCountRecord) {
                        this.jumpCountRecord = this.jumpCount;
                    }
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
}

};

var selectedItem = 0;

InfinityRun.keydown = function() {
    if (InfinityRun.keys.ESCAPE && GameState==State.Started) {
		InfinityRun.clear();
		GameState = State.Menu;
		bgaudio.pause();
	    bgaudio.src = 'sounds/menu.wav';
	    bgaudio.load();
		bgaudio.play();
		
	} else if (InfinityRun.keys.ESCAPE && GameState==State.Menu) {
		GameState = State.Started;
	}
	if (InfinityRun.keys.UP) {
		selectedItem = (selectedItem + items.length - 1) % items.length;
	}
	if (InfinityRun.keys.DOWN) {
		selectedItem = (selectedItem + 1) % items.length;
	}
	
	if(InfinityRun.keys.ENTER) {
		callback(selectedItem);
	}
	
}

Menu = function() {

	//this.backgroundCallback = null;
}


//--------- Draw ---------

InfinityRun.draw = function() {
	if(GameState == State.Started) {
    this.player.draw();

    for (i = 0; i < this.platformManager.platforms.length; i++) {
        this.platformManager.platforms[i].draw();
    };

    //Draw particles
    for (i = 0; i < this.particles.length; i++) {
        this.particles[i].draw();
    };
	
	//Draw menu --TODO prototype
	} else if (GameState == State.Menu) {
	
	this.title = "InfinityRun";
	items = ["Play", "Settings", "Highscore"];
	
	callback = function(numItem) { if (numItem == 0) GameState=State.Started };
	this.height = InfinityRun.height;
	this.width = InfinityRun.width;
	this.size = 120;	
	
	var lingrad = this.createLinearGradient(0,0,0,this.height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#023');
	this.fillStyle = lingrad;
	this.fillRect(0,0,this.width, this.height)
	
	this.textAlign = "center";
	this.fillStyle = "White";
	
	var height = 150;
	
	if (this.title) {
		this.font = Math.floor(this.size*1.3).toString() + "px Times New Roman";
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
		this.font = size.toString() + "px Times New Roman";
		height += this.size;
		this.fillText(items[i], InfinityRun.width/2, height);
		this.fillStyle = "White";
	}
	
	}
	

	
    //Debug
    if (debug) {
        this.font = '12pt Arial';
        this.fillStyle = '#181818';
        this.fillText('Record: ' + this.jumpCountRecord, this.width - 150, 33);
        this.fillStyle = this.scoreColor;
        this.fillText('Jumps: ' + this.jumpCount, this.width - 150, 50);
        this.fillText('Distance: ' + 0/* -TODO- */, this.width - 150, 65);
	this.fillText('GameState: ' + GameState, this.width - 150, 80);
    }

};

InfinityRun.resize = function() {
    /* todo Windowscale optimization
     *
     *
     */
}
