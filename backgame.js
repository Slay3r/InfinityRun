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
 
 //////////////////////////////////////////////
 // PUSH!
 //////////////////////////////////////////////
 
var i = 0;

var State = { Menu:0, Started:1, Paused:2, Over:3 };
var GameState = State.Menu;
var MainMenu;



var debug = true;

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

//--------------init
  var Mountain, MountainRange, dt, mountainRanges;
  
  InfinityRun.mouse.x = InfinityRun.width / 10;

  InfinityRun.mouse.y = InfinityRun.height;

  mountainRanges = [];
  
  dt = 1;
//---------------

 
  Mountain = function(config) {
    return this.reset(config);
  };

  Mountain.prototype.reset = function(config) {
    this.layer = config.layer;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    return this.color = config.color;
  };

  MountainRange = function(config) {
    this.x = 0;
    this.mountains = [];
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

  MountainRange.prototype.populate = function() {
    var newHeight, newWidth, results, totalWidth;
    totalWidth = 0;
    results = [];
    while (totalWidth <= InfinityRun.width + (this.width.max * 4)) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      this.mountains.push(new Mountain({
        layer: this.layer,
        x: this.mountains.length === 0 ? 0 : this.mountains[this.mountains.length - 1].x + this.mountains[this.mountains.length - 1].width,
        y: InfinityRun.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      }));
      results.push(totalWidth += newWidth);
    }
    return results;
  };

  MountainRange.prototype.update = function() {
    var firstMountain, lastMountain, newHeight, newWidth;
    this.x -= (InfinityRun.mouse.x * this.speed) * dt;
    firstMountain = this.mountains[0];
    if (firstMountain.width + firstMountain.x + this.x < -this.width.max) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      lastMountain = this.mountains[this.mountains.length - 1];
      firstMountain.reset({
        layer: this.layer,
        x: lastMountain.x + lastMountain.width,
        y: InfinityRun.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      });
      return this.mountains.push(this.mountains.shift());
    }
  };

  MountainRange.prototype.render = function() {
    var c, d, i, j, pointCount, ref;
    InfinityRun.save();
    InfinityRun.translate(this.x, (InfinityRun.height - InfinityRun.mouse.y) / 20 * this.layer);
    InfinityRun.beginPath();
    pointCount = this.mountains.length;
    InfinityRun.moveTo(this.mountains[0].x, this.mountains[0].y);
    for (i = j = 0, ref = pointCount - 2; j <= ref; i = j += 1) {
      c = (this.mountains[i].x + this.mountains[i + 1].x) / 2;
      d = (this.mountains[i].y + this.mountains[i + 1].y) / 2;
      InfinityRun.quadraticCurveTo(this.mountains[i].x, this.mountains[i].y, c, d);
    }
    InfinityRun.lineTo(InfinityRun.width - this.x, InfinityRun.height);
    InfinityRun.lineTo(0 - this.x, InfinityRun.height);
    InfinityRun.closePath();
    InfinityRun.fillStyle = this.color;
    InfinityRun.fill();
    return sketch.restore();
  };
  
//-----------------------------------------------

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
    }

    if ((InfinityRun.keys.UP || InfinityRun.keys.SPACE || InfinityRun.keys.W || InfinityRun.dragging) && this.velocityY < -8) {
        this.velocityY += -0.75;
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

    this.platformManager = new PlatformManager();

    this.particles = [];
    this.particlesIndex = 0;
    this.particlesMax = 20;
    this.collidedPlatform = null;
    this.scoreColor = '#181818';
    this.jumpCountRecord = 0;
	
	//-----------------------------------
	var i, results;
    i = 5;
    results = [];
    while (i--) {
      results.push(mountainRanges.push(new MountainRange({
        layer: i + 1,
        width: {
          min: (i + 1) * 50,
          max: (i + 1) * 70
        },
        height: {
          min: 200 - (i * 40),
          max: 300 - (i * 40)
        },
        speed: (i + 1) * .003,
        color: 'hsl( 120, ' + (((i + 1) * 1) + 10) + '%, ' + (75 - (i * 13)) + '% )'
      })));
    }
    return results;
	//----------------------------------------
};



InfinityRun.update = function() {	
	//----------------------
	  var i, results;
    dt = InfinityRun.dt < .1 ? .1 : InfinityRun.dt / 16;
    dt = dt > 5 ? 5 : dt;
    i = mountainRanges.length;
    results = [];
    while (i--) {
      results.push(mountainRanges[i].update(i));
    }
    return results;
	
	//------------------------
	if (GameState == State.Started) {
    this.player.update();	
    switch (this.jumpCount) {
        case 10:
            this.accelerationTweening = 1;
            this.platformManager.maxDistanceBetween = 430;
            //this.scoreColor = '#076C00';
            break;
        case 25:
            this.accelerationTweening = 2;
            this.platformManager.maxDistanceBetween = 530;
            //this.scoreColor = '#0300A9';
            break;
        case 40:
            this.accelerationTweening = 3;
            this.platformManager.maxDistanceBetween = 580;
            //this.scoreColor = '#9F8F00';
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
	var i, results;
    i = 5;
    results = [];
    while (i--) {
      results.push(mountainRanges.push(new MountainRange({
        layer: i + 1,
        width: {
          min: (i + 1) * 50,
          max: (i + 1) * 70
        },
        height: {
          min: 200 - (i * 40),
          max: 300 - (i * 40)
        },
        speed: (i + 1) * .003,
        color: 'hsl( 120, ' + (((i + 1) * 1) + 10) + '%, ' + (75 - (i * 13)) + '% )'
      })));
    }
	/*
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
	

	*/
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
	return results;
};

InfinityRun.resize = function() {
    /* todo Windowscale optimization
     *
     *
     */
}
