
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

  for (var i = 0; i <= this.cards.length; i++) {
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
    if (value + 10 <= 21) {
      value += 10;
    } else {
      value += 1;
    }
  });

  return value;
};
