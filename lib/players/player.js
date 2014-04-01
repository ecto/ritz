var Player = module.exports = function Player () {
  this.name = null;
  this.hands = [];
  this.balance = 0;
  this.handsPlayed = 0;
};

Player.prototype.join = function (game) {
  return game.addPlayer(this);
};

Player.prototype.bet = function (amount) {
  this.handsPlayed++;
  var bet = this.game.minBet;
  return bet;
};

Player.prototype.decide = function (hand) {
  return 'stand';
};

