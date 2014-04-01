var util = require('util');
var Player = require('./player');

var Dealer = module.exports = function Dealer () {
  Player.call(this);
  this.isDealer = true;
  this.hitsSoft17 = true;
};

util.inherits(Dealer, Player);

Dealer.prototype.bet = function () {
  return 0;
};

Dealer.prototype.decide = function (hand) {
  var handValue = hand.getValue();
  var isSoft = hand.isSoft();

  if (handValue > 17) {
    return 'stand';
  }

  if (handValue == 17) {
    if (isSoft && this.hitsSoft17) {
      return 'hit';
    } else {
      return 'stand';
    }
  }
  
  return 'hit';
};

