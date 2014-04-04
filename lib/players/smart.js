var util = require('util');
var Player = require('./player');

var SmartPlayer = module.exports = function SmartPlayer () {
  Player.call(this);
};

util.inherits(SmartPlayer, Player);

SmartPlayer.prototype.bet = function () {
  this.handsPlayed++;
  var bet = this.game.minBet;
  return bet;
};

SmartPlayer.prototype.decide = function (hand) {
  var handValue = hand.getValue();

  if (handValue == 21) {
    return 'stand';
  }

  var isSoft = hand.isSoft();
  var hasPlayedBefore = hand.cards.length > 2;

  var upcard = this.game.getDealerCard().blackjackValue();
  if (upcard instanceof Array) {
    upcard = 'A';
  } else {
    upcard = upcard.toString();
  }

  var hardCard = hand.getHardCard();

  if (hardCard) {
    hardCard = hardCard.blackjackValue();

    if (hardCard instanceof Array) {
      hardCard = 'A';
    } else {
      hardCard = hardCard.toString();
    }
  }

  if (!hasPlayedBefore) {
    // is it a pair?
    var aValue = hand.cards[0].normalizedBlackjackValue();
    var bValue = hand.cards[1].normalizedBlackjackValue();
    if (aValue == bValue) {
      return pairTable[hardCard || 'A'][upcard];
    }

    // is it a soft hand?
    if (isSoft) {
      return softTable[hardCard][upcard];
    }
  }

  return hardTable[handValue][upcard];
};

var SP = 'split';
var S = 'stand';
var H = 'hit';
var D = 'double';

var pairTable = {
  'A': { 'A': SP, '10': SP, '9': SP, '8': SP, '7': SP, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP },
  '10': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': S, '5': S, '4': S, '3': S, '2': S },
  '9': { 'A': S, '10': S, '9': SP, '8': SP, '7': S, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP },
  '8': { 'A': SP, '10': SP, '9': SP, '8': SP, '7': SP, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP },
  '7': { 'A': H, '10': H, '9': H, '8': H, '7': SP, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP },
  '6': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '5': { 'A': H, '10': H, '9': D, '8': D, '7': D, '6': D, '5': D, '4': D, '3': D, '2': D },
  '4': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': SP, '5': SP, '4': H, '3': H, '2': H },
  '3': { 'A': H, '10': H, '9': H, '8': H, '7': SP, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP },
  '2': { 'A': H, '10': H, '9': H, '8': H, '7': SP, '6': SP, '5': SP, '4': SP, '3': SP, '2': SP }
};

var softTable = {
  '9': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': D, '5': D, '4': D, '3': D, '2': D },
  '8': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': D, '5': D, '4': D, '3': D, '2': D },
  '7': { 'A': H, '10': H, '9': H, '8': S, '7': S, '6': D, '5': D, '4': D, '3': D, '2': D },
  '6': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': D, '3': D, '2': H },
  '5': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': D, '3': H, '2': H },
  '4': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': D, '3': H, '2': H },
  '3': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': H, '3': H, '2': H },
  '2': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': H, '3': H, '2': H }
};

var hardTable = {
  '20': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': S, '5': S, '4': S, '3': S, '2': S },
  '19': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': S, '5': S, '4': S, '3': S, '2': S },
  '18': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': S, '5': S, '4': S, '3': S, '2': S },
  '17': { 'A': S, '10': S, '9': S, '8': S, '7': S, '6': S, '5': S, '4': S, '3': S, '2': S },
  '16': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': S, '4': S, '3': S, '2': S },
  '15': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': S, '4': S, '3': S, '2': S },
  '14': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': S, '4': S, '3': S, '2': S },
  '13': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': S, '4': S, '3': S, '2': S },
  '12': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': S, '4': S, '3': H, '2': H },
  '11': { 'A': H, '10': D, '9': D, '8': D, '7': D, '6': D, '5': D, '4': D, '3': D, '2': D },
  '10': { 'A': H, '10': H, '9': D, '8': D, '7': D, '6': D, '5': D, '4': D, '3': D, '2': D },
  '9': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': D, '5': D, '4': D, '3': D, '2': H },
  '8': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '7': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '6': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '5': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '4': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '3': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H },
  '2': { 'A': H, '10': H, '9': H, '8': H, '7': H, '6': H, '5': H, '4': H, '3': H, '2': H }
};
