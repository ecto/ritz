var util = require('util');
var Player = require('./player');

var Dealer = module.exports = function Dealer () {
  this.isDealer = true;
  this.hitsSoft17 = true;
};

util.inherits(Dealer, Player);

Dealer.prototype.bet = function () {
  return 0;
};

Dealer.prototype.decide = function () {
  return 'hit';
};

