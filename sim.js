var Deck = require('./deck');
var Shoe = require('./shoe');
var Game = require('./game');
var Player = require('./player');

/*
var shoe = new Shoe();
shoe.shuffle();
console.log(shoe.toString());
console.log(shoe.cards.length);
*/

var game = new Game();
var player = new Player();
player.name = 'Alice';
player.join(game);
game.play();
