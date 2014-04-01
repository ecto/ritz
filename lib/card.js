var Card = module.exports = function Card () {
  this.suit = null;
  this.value = 0;
};

Card.prototype.toString = function () {
  return this.faceValue() + ' of ' + this.suit + 's';
};

Card.prototype.faceValue = function () {
  switch (this.value) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10: return this.value.toString();
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    case 14: return 'A';
  }
};

Card.prototype.blackjackValue = function () {
  switch (this.value) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10: return this.value;
    case 11:
    case 12:
    case 13: return 10;
    case 14: return [ 1, 10 ];
  }
};

Card.prototype.normalizedBlackjackValue = function () {
  var normal = this.blackjackValue();

  if (normal instanceof Array) {
    normal = 'A';
  } else {
    normal = normal.toString();
  }
};

Card.prototype.isValid = function () {

};

Card.prototype.isAce = function () {

};
