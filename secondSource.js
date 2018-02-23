var game;

// when the window loads...
window.onload = function() {

// game creation
game = new Phaser.Game(320, 480, Phaser.CANVAS);

// adding "Play" state and execute it
game.state.add("Play", play, true);
}

// "Play" state
var play = function(){}
play.prototype = {

// when the state preloads
preload:function(){

// loading graphic assets
game.load.image("player", "player.png");
game.load.image("enemy", "enemy.png");
},

// once the state has been created
create:function(){

// maximizing the game
game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
game.scale.pageAlignHorizontally = true;
game.scale.pageAlignVertically = true;

// set the score to zero
this.score = 0;

// set top score to local storage saved score, if any, or zero.
this.topScore = localStorage.getItem("topboomdots") == null ? 0 : localStorage.getItem("topboomdots");

// adding a text object which will display the score
this.scoreText = game.add.text(10, 10, "-", {
font:"bold 16px Arial",
fill: "#acacac"
});

// we'll call this method each time we need to update the score
this.updateScore();

// ladies and gentlemen, the player
this.player = game.add.sprite(game.width / 2, game.height / 5 * 4, "player");

// set player registration point to its center
this.player.anchor.setTo(0.5);

// ladies and gentlemen, the enemy :)
this.enemy = game.add.sprite(game.width, 0, "enemy");

// set enemy registration point to its center
this.enemy.anchor.set(0.5);

// method to place the player
this.placePlayer();

// method to place the enemy
this.placeEnemy();
},

// function to be executed at each frame
update:function(){

// if the player touches the enemy
if(Phaser.Math.distance(this.player.x, this.player.y, this.enemy.x, this.enemy.y) < this.player.width / 2 + this.enemy.width / 2){

// stop enemy tween
this.enemyTween.stop();

// stop player tween
this.playerTween.stop();

// adding one point to the score
this.score ++;

// this is a perfect shot: player and enemy are almost aligned on the vertical axis
if(Math.abs(this.player.x - this.enemy.x) < 10){

// a bonus score
this.score += 2;
}

// place the enemy again
this.placeEnemy();

// place the player again
this.placePlayer();

// update score text
this.updateScore();
}
},

// method to update the score
updateScore: function(){
this.scoreText.text = "Score: " + this.score + " - Best: " + this.topScore;
},

// method to place the player
placePlayer: function(){

// set player horizontal position
this.player.x = game.width / 2;

// set player vertical position
this.player.y = game.height / 5 * 4;

// player tween to move the player to the bottom of the screen. The higher the score, the faster the tween
this.playerTween = game.add.tween(this.player).to({
y: game.height
}, 10000 - this.score * 10, Phaser.Easing.Linear.None, true);

// if the tween completes, it's game over and we call die method
this.playerTween.onComplete.add(this.die, this);

// waiting for player input to call fire method
game.input.onDown.add(this.fire, this);
},

// game over
die: function(){

// update local storage saving the max between current score and top score
localStorage.setItem("topboomdots", Math.max(this.score, this.topScore));

// start the game again
game.state.start("Play");
},

// method to place the enemmy
placeEnemy: function(){

// set enemy x position
this.enemy.x = game.width - this.enemy.width / 2;

// set enemy y position
this.enemy.y = -this.enemy.width / 2;

// tween to make the enemy enter on the stage
var enemyEnterTween = game.add.tween(this.enemy).to({
y: game.rnd.between(this.enemy.width * 2, game.height / 4 * 3 - this.player.width / 2)
}, 200, Phaser.Easing.Linear.None, true);

// once the tween is completed, move the enemy horizontally
enemyEnterTween.onComplete.add(this.moveEnemy, this);
},

// method to move the enemy
moveEnemy: function(){

// yoyo tween to move the enemy left and right
this.enemyTween = game.add.tween(this.enemy).to({
x: this.enemy.width / 2
}, 500 + game.rnd.between(0, 2500), Phaser.Easing.Cubic.InOut, true, 0, -1, true);
},

// method to fire
fire: function(){

// removing input listener
game.input.onDown.remove(this.fire, this);

// stop current player tween
this.playerTween.stop();

// tween to fire the player to the top of the stage
this.playerTween = game.add.tween(this.player).to({
y: -this.player.width
}, 500, Phaser.Easing.Linear.None, true);

// if the tween completes, that is the player missed the enemy, then it's game over
this.playerTween.onComplete.add(this.die, this);
}
}