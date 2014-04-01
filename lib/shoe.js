var utils = require('./utils');
var Deck = require('./deck');

var Shoe = module.exports = function Shoe (numDecks) {
  this.numDecks = numDecks || 6;
  this.maxPenetration = 0.75;
  this.originalLength = 0;
  this.cards = [];

  this.create();
};

Shoe.prototype.create = function () {
  for (var i = 0; i < this.numDecks; i++) {
    var deck = new Deck();

    for (var j = 0; j < deck.cards.length; j++) {
      this.cards.push(deck.cards[j]);
    }
  }

  this.originalLength = this.cards.length;
};

Shoe.prototype.toString = function () {
  return utils.cardsToString(this.cards);
};

Shoe.prototype.shuffle = function () {
  this.cards = utils.shuffle(this.cards);
};

Shoe.prototype.isPenetrated = function (withCards) {
  return this.willPenetrate(0);
};

Shoe.prototype.willPenetrate = function (withCards) {
  var futurePenetration = (
    this.originalLength - (this.cards.length - withCards)
  ) / this.originalLength;

  if (futurePenetration >= this.maxPenetration) {
    return true;
  }

  return false;
};

Shoe.prototype.getCard = function () {
  var card = this.cards.shift();
  return card;
};
