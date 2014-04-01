
var Hand = module.exports = function Hand () {
  this.cards = [];
  this.bet = 0;
  this.status = 'open';
};

Hand.prototype.deal = function (card) {
  this.cards.push(card);

  if (this.getValue() == 21) {
    this.status = 'stand';
  }

  if (this.getValue() > 21) {
    this.status = 'bust';
  }
};

Hand.prototype.isSoft = function () {
  // this may be naive

  for (var i = 0; i < this.cards.length; i++) {
    if (this.cards[i].faceValue() == 'A') {
      return true;
    }
  }

  return false;
};

Hand.prototype.getValue = function () {
  var value = 0;
  var extras = [];

  this.cards.forEach(function (card) {
    if (card.faceValue() == 'A') {
      extras.push(card);
      return;
    }

    value += card.blackjackValue();
  });

  extras.forEach(function (card) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  });

  return value;
};

Hand.prototype.getHardCard = function () {
  // this is naive
  for (var i = 0; i < this.cards.length; i++) {
    if (this.cards[i].faceValue() != 'A') {
      return this.cards[i];
    }
  }
};

Hand.prototype.toString = function () {
  var ret = [];

  this.cards.forEach(function (card) {
    ret.push(card.faceValue());
  });

  return ret.join(' ');
};

