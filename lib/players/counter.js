var util = require('util');
var SmartPlayer = require('./smart');

var CardCounter = module.exports = function CardCounter () {
  SmartPlayer.call(this);

  this.count = 0;
};

util.inherits(CardCounter, SmartPlayer);

CardCounter.prototype.bet = function () {
  this.handsPlayed++;
  var bet = this.game.minBet;

  if (this.count > 80) {
    bet = this.game.maxBet;
  } else if (this.count > 40) {
    bet *= 4;
  } else if (this.count > 20) {
    bet *= 2;
  }

  return bet;
};

CardCounter.prototype.decide = function (hand) {
  var that = this;
  var cards = this.game.getAllCards();
  var basic = SmartPlayer.prototype.decide.call(this, hand);

  cards.forEach(function (card) {
    switch (card) {
      case 'A':
      case '10': card = 'high'; break;
      case '9':
      case '8':
      case '7': card = 'neutral'; break;
      case '6':
      case '5':
      case '4':
      case '3':
      case '2': card = 'low'; break;
      default: throw card;
    }

    if (card == 'low') {
      that.count += 1;
    }

    if (card == 'high') {
      that.count -= 1;
    }
  });

  return basic;
};

CardCounter.prototype.gameDidEnd = function () {
  this.count = 0;
};

