var sprites = {
 fondo: { sx: 433, sy: 0 , w: 549, h: 624, frames: 1 },
 rana: { sx: 0, sy: 338, w: 36, h: 48, frames: 1 }, 
 coche1: { sx: 6, sy: 5, w: 93, h: 48, frames: 1 },
 coche2: { sx: 112, sy: 5, w: 93, h: 48, frames: 1 },
 coche3: { sx: 212, sy: 5, w: 93, h: 48, frames: 1 },
 coche4: { sx: 6, sy: 60, w: 124, h: 48, frames: 1 },
 coche5: { sx: 146, sy: 61, w: 202, h: 48, frames: 1 },
 tronco: { sx: 9, sy: 122, w: 192, h: 40, frames: 1 },
 muerte: { sx:210, sy: 129, w:48, h:34, frames:1},
 tortuga: { sx: 0, sy: 288, w: 54, h: 48, frames: 1, }
};

var enemies = {
  coche1: { sprite: 'coche1', speed: 200},
  coche2: { sprite: 'coche2', speed: 200},
  coche3: { sprite: 'coche3', speed: 200},
  coche4: { sprite: 'coche4', speed: 300},
  coche5: { sprite: 'coche5', speed: -100},
  log1: {sprite: 'log',row: 0,speed: -200},
  log2: {sprite: 'log',row: 2,speed: -155},
  log3: {sprite: 'log',row: 4,speed: -120},
  toruga1: {sprite: 'tortuga', row:1, speed: 50},
  toruga2: {sprite: 'tortuga', row:3, speed: 50},
};

var RANA = 1,
    MADERA = 2,
    COCHE = 4,
    AGUA = 8,
    TORTUGA = 16;

var level=[];

var startGame = function() {
	Game.setBoard(1, new TitleScreen("Froggerr",
	 "Press space to start playing",
	 playGame));
	Game.lives = 3;

	level = [
		[3, new Car(enemies.coche1.sprite, enemies.coche1.speed, 1)],
		[2.5, new Car(enemies.coche2.sprite, enemies.coche2.speed, 2)],
		[3.5, new Car(enemies.coche3.sprite, enemies.coche3.speed, 3)],
		[4, new Car(enemies.coche4.sprite, enemies.coche4.speed, 4)],
		[6, new Car(enemies.coche5.sprite, enemies.coche5.speed, 5)],
		[3, new Trunk(enemies.log1.row, enemies.log1.speed)],
		[5, new Trunk(enemies.log2.row, enemies.log2.speed)],
		[4, new Trunk(enemies.log3.row, enemies.log3.speed)],
		[2, new Turtles(enemies.toruga1.row, enemies.toruga1.speed)],
		[2.5, new Turtles(enemies.toruga2.row, enemies.toruga2.speed)]
	];
  
};

var playGame = function() {
  var fondo = new GameBoard();
  fondo.add(new Background());
  Game.setBoard(0,fondo);

  var tableroJuego = new GameBoard();
  tableroJuego.add(new Level(level));
  tableroJuego.add(new Fin());
  tableroJuego.add(new Water());
  tableroJuego.add(new Frog());
  Game.setBoard(1,tableroJuego);
  
  Game.setBoard(2, new Life(playGame));
};

var winGame = function() {
  Game.setBoard(1,new TitleScreen("Ganaste!", 
                                  "Felicidades",
                                  startGame));
};

var loseGame = function() {
  Game.setBoard(1,new TitleScreen("Has perdido!", 
                                  "Prueba otra vez",
                                  startGame));
};
//Pinta el fondo
var Background = function(){
	this.setup('fondo',{
		zIndex: 0
	});
	this.x=0;
	this.y=0;
};

Background.prototype = new Sprite();

Background.prototype.step = function(dt) {};

var Level= function(levelData){
	this.levelData= levelData;
	this.t=0;
};

Level.prototype = new Sprite();
Level.prototype.draw = function() {};
Level.prototype.step = function(dt) {
    if (this.t == 0) {
        for (var i = 0; i < this.levelData.length; i++) {
            this.board.add(new Spawner(this.levelData[i]));
        }
        this.t++;
    }
};

var Spawner = function(data) {
    this.gap = data[0];
    this.obj = data[1];
    this.zIndex = 0;
    this.t = 0;
}

Spawner.prototype = new Sprite();
Spawner.prototype.draw = function() {};
Spawner.prototype.step = function(dt) {
    this.t += dt;
    if (this.t >= this.gap) {
        this.board.add(Object.create(this.obj));
        this.t -= this.gap;
    }
};

//Pinta a la rana
var Frog= function(){
	this.setup('rana', { vx: 0, reloadTime:0.25, zIndex:6});
	this.reload = this.reloadTime;
	this.x = Game.width/2 - this.w / 2;
  	this.y = Game.height - this.h;
  	this.lifes= Game.lives;

};

Frog.prototype = new Sprite();
Frog.prototype.type = RANA;

Frog.prototype.onLog = function(vLog) {
    this.vx = vLog;
};

Frog.prototype.hit = function() {
    Game.lives--;
    if (this.board.remove(this)) {
        this.board.add(new Death(this));
    }

};

Frog.prototype.step= function(dt){
	if(this.board.collide(this, AGUA) && !this.board.collide(this,MADERA) && !this.board.collide(this,TORTUGA)){
		this.hit()
	}

	this.reload-=dt;
	if(this.reload<=0){
		this.x+=this.vx*dt;
	

		if(Game.keys['up']){
			this.reload= this.reloadTime;
			this.y-=this.h;
		} else if (Game.keys['down']) {
	        this.reload = this.reloadTime;
	        this.y += this.h;
	    } else if (Game.keys['right'] && (this.x + this.w <= Game.width - this.w)) {
	        this.reload = this.reloadTime;
	        this.x += this.w;
	    } else if (Game.keys['left'] && (this.x - this.w >= 0)) {
	        this.reload = this.reloadTime;
	        this.x -= this.w;
		}

		if (this.y < 0){
		 	this.y = 0;
		}else if (this.y > Game.height - this.h){
			this.y = Game.height - this.h;
		}
        if (this.x < 0){ 
        	this.x = 0;
		}else if (this.x > Game.width - this.w){
			this.x = Game.width - this.w;
		}
	}
	this.vx = 0;

};

var Turtles= function(row, speed){
	this.setup('tortuga', {
        frame: 0,
        f: 0,
        zIndex: 1
    });
    this.xSpeed = speed;
    this.x =(speed>0)?0:Game.width;
    this.y = 48+row*48;
};

Turtles.prototype = new Sprite();
Turtles.prototype.type= TORTUGA;
Turtles.prototype.step = function(dt) {
    if (this.x+this.width <0 || this.x > Game.width) {
        this.board.remove(this);
    }
    this.f += dt;
    if (this.f >= 1 / 4) {
        this.f -= 1 / 4;
        this.frame++;
    }
    if (this.frame > sprites.tortuga.frames)
        this.frame = 0;
    this.x += this.xSpeed * dt;
    var col = this.board.collide(this, RANA);
    if (col) {
        col.onLog(this.xSpeed);
    }

};

var Trunk= function(row, speed){
	this.setup('tronco',{ zIndex:1});
	this.xVel=speed;
	this.x=(speed>0)?0:Game.width;
	this.y= 48+row*48;
};

Trunk.prototype = new Sprite();
Trunk.prototype.type= MADERA;
Trunk.prototype.step= function(dt){
	this.x+= this.xVel*dt;
	if(this.x+this.width <0 || this.x > Game.width)
		this.board.remove(this);
	var rana = this.board.collide(this, RANA);
	if(rana){
		rana.onLog(this.xVel);
	}
}

var Car= function(sprite, speed, pos) {
	this.setup(sprite, {zIndex:2});
	this.xVel= speed;
	this.x = (speed >0)? 0: Game.width;
	this.y = Game.height- 48 -(pos*48);
	
};

Car.prototype= new Sprite();
Car.prototype.type = COCHE;

Car.prototype.step = function(dt){
	this.x += this.xVel*dt;
	if (this.x + this.width < 0 || this.x > Game.width)
		this.board.remove(this);

	var choque = this.board.collide(this, RANA);
	if (choque) {
        choque.hit();
        this.board.remove(this);
	}
};

var Water = function(){
	this.y= 48;
	this.x=0;
	this.w=Game.width;
	this.h= 48*5;
	this.xIndex=0;
}

Water.prototype = new Sprite();
Water.prototype.type = AGUA;
Water.prototype.draw = function() {};
Water.prototype.step = function(dt) {};

var Death = function(rana){
	this.setup('muerte', {
        frame: 0,
        f: 0,
        zIndex: 5
    });
    this.rana = rana;
    this.x = rana.x;
    this.y = rana.y;
	this.end = false;

}

Death.prototype = new Sprite();
Death.prototype.step = function(dt) {
	this.f += dt;
    if (this.f >= 1 / 4) {
        this.f -= 1 / 4;
        this.frame++;
    }

    if (this.frame > sprites['muerte'].frames) {
        this.board.remove(this);
        if (!this.end)
            if (Game.lives <= 0) {
                loseGame();
            } else {
                this.board.add(new Frog());
            }
        this.end = true;

	}

};

var Fin = function() {
    this.x = 0;
    this.y = 0;
    this.w = Game.width;
    this.h = 48;
    this.zIndex = 0;

};
Fin.prototype = new Sprite();
Fin.prototype.step = function(dt) {
    var col = this.board.collide(this, RANA);
    if (col && col.type === RANA) {
        this.board.remove(col);
        winGame();
    }

};

Fin.prototype.draw = function() {};


window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});


