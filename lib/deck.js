var Card = require('./card');
var utils = require('./utils');

var Deck = module.exports = function Deck () {
  this.cards = [];

  this.suits = [
    'club',
    'spade',
    'heart',
    'diamond'
  ];

  this.values = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14
  ];

  this.create();
};

Deck.prototype.create = function () {
  var that = this;

  that.suits.forEach(function (suit) {
    that.values.forEach(function (value) {
      var card = new Card();
      card.suit = suit;
      card.value = value;
      that.cards.push(card);
    });
  });
};

Deck.prototype.shuffle = function () {
  this.cards = utils.shuffle(this.cards);
};

Deck.prototype.toString = function () {
  return utils.cardsToString(this.cards);
};

