// starts with 1 players
  // dealer
// starts with new game
// game is paused

// players may join
// game plays while there is > 1 players
// game is paused when last player leaves

var Game = require('./game');
var Dealer = require('./players').Dealer;

var Table = module.exports = function Table () {
  this.game = null;
  this.gameCount = 0;
  this.players = [];
  this.isActive = false;
  this.logger = function () {};

  this.create();
};

Table.prototype.create = function () {
  var that = this;

  that.gameCount++;
  that.game = new Game();

  // when a game ends,
  // create a new one and add all players.
  // if there are nondealer players,
  // start the game
  that.game.on('over', function () {
    that.create();
    that.game.players = that.players;
    that.game.dealer = that.dealer;

    if (that.players.length > 1) {
      that.game.play();
    }
  });

  that.game.on('roundEnd', function () {
    that.logger();
  });

  // if there isn't a dealer,
  // add one to the table
  if (!that.players.length) {
    var dealer = new Dealer();
    that.players.push(dealer);
    that.dealer = dealer;
    that.game.players[0] = dealer;
    that.game.dealer = dealer;
  }
};

Table.prototype.close = function () {
  this.isActive = false;
};

Table.prototype.addPlayer = function (player) {
  if (player.balance <= 0) {
    return false;
  }

  if (~this.players.indexOf(player)) {
    return false;
  }

  this.players.push(player);
  var added = this.game.addPlayer(player);

  // first player to join the game,
  // start it up
  if (added && this.players.length == 2) {
    this.isActive = true;
    this.game.play();
  }
};

