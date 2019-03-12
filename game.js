var sprites = {
 fondo: { sx: 433, sy: 0 , w: 549, h: 624, frames: 1 },
 rana: { sx: 0, sy: 338, w: 36, h: 48, frames: 1 }, 
 coche1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
 coche2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },
 coche3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
 coche4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
 coche5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
 tronco: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
 death: { sx:0, sy: 143, w:48, h:48, frames:4},
 tortuga: { sx: 0, sy: 288, w: 54, h: 47, frames: 1, }
};

var enemies = {
  coche1: { sprite: 'coche1', speed: -200},
  coche2: { sprite: 'coche2', speed: 200},
  coche3: { sprite: 'coche3', speed: -200},
  coche4: { sprite: 'coche4', speed: -300},
  log1: {sprite: 'log',row: 0,speed: -200},
  log2: {sprite: 'log',row: 1,speed: 155},
  log3: {sprite: 'log',row: 2,speed: -120},
};

var RANA = 1,
    MADERA = 2,
    COCHE = 4,
    AGUA = 8,
    BICHO = 16;

var level=[];

var startGame = function() {
  
};



var playGame = function() {
  var board = new GameBoard();
  board.add(new Background());
  Game.setBoard(0,board);

  var tableroJuego = new GameBoard();
  tableroJuego.add(new Frog());
  tableroJuego.add(new Tortuga());
  Game.setBoard(1,tableroJuego);
};

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
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


//Pinta a la rana
var Frog= function(){
	this.setup('rana', { vx: 0, reloadTime:0.25, zIndex:4});
	this.reload = this.reloadTime;
	this.x = Game.width/2 - this.w / 2;
  	this.y = Game.height - this.h;

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
	if(this.board.collide(this, AGUA) && !this.board.collide(this,LOG)){
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

var Tortuga= function(){
	this.setup('tortuga', {
        frame: 0,
        f: 0,
        zIndex: 5
    });
    this.xSpeed = 54;
    this.x = 0;
    this.y = Game.height/12;
	this.zIndex = 5;
};

Tortuga.prototype = new Sprite();
Tortuga.prototype.step = function(dt) {
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
        col.hit();
    }

};

var Tronco= function(row, speed){
	var seed= Math.random();
	this.setup('tronco',{ zIndex:1});
	this.xVel=speed;
	this.x=(speed>0)?0:Game.width;
	this.y= 48+row*48;
};

Tronco.prototype = new Sprite();
Tronco.prototype.type= MADERA;
Tronco.prototype.step= function(dt){
	this.x+= this.xVel*dt;
	if(this.x+this.width <0 || this.x > Game.width)
		this.board.remove(this);
	var rana = this.board.collide(this, RANA);
	if(rana){
		rana.onLog(this.xVel);
	}
}

var Coche= function(sprite, speed) {
	this.setup(sprite, {zIndex:5});
	this.xVel= speed;
	this.x = (speed >0)? 0: Game.width;
	this.y = Game.height- 48 -(parseInt(sprite[3])*48);
	
};

Coche.prototype= new Sprite();
Coche.prototype.type = COCHE;

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






window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});


