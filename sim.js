var ritz = require('./lib')();
var Game = ritz.Game;
var Player = ritz.players.Base;

/*
// Create a deck
var deck = new ritz.Deck();
deck.shuffle();
console.log(deck.toString());
console.log(deck.cards.length, 'cards');

// Create a shoe
var shoe = new ritz.Shoe();
shoe.shuffle();
console.log(shoe.toString());
console.log(shoe.cards.length, 'cards');
*/

var player = new Player();
player.name = 'Alice';
player.balance = 10000;

var player2 = new Player();
player2.name = 'Bob';
player2.balance = 10000;

var game;
function newGame () {
  game = new Game();
  player.join(game);
  player2.join(game);
  game.on('over', function () {
    newGame();
  });
  game.play();
}

newGame();
