var Shoe = require('./shoe');
var Hand = require('./hand');
var Player = require('./player');
var Dealer = require('./dealer');

var CLITable = require('cli-table');

var Game = module.exports = function Game (options) {
  this.options = options || {};
  this.shoe = null;
  this.done = false;
  this.paused = true;
  this.round = 0;
  this.minBet = 5;
  this.maxBet = 100;
  this.maxPlayers = 2;
  this.players = [];

  this.create();
};

Game.prototype.create = function () {
  this.shoe = new Shoe(this.options.decksPerShoe);
  this.shoe.shuffle();

  var dealer = new Dealer();
  this.players.push(dealer);
  this.dealer = dealer;
};

Game.prototype.addPlayer = function (player) {
  this.players.push(player);
  player.game = this.getPlayerInterface();
};

Game.prototype.processRound = function () {
  var that = this;

  // make sure there are enough players, otherwise wait
  // maybe do this on the table level?

  this.round++;
  this.deal();

  // if dealer has blackjack, skip playing

  // while non-dealer players have active hands
    // for each hand, 
      // while not busted or stood,
      // make them decide
  that.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    player.hands.forEach(function (hand) {
      while (hand.status == 'open') {
        var decision = player.decide();

        if (decision == 'hit') {
          var card = that.shoe.getCard();
          hand.deal(card);
        }

        if (decision == 'stand') {
          hand.status = 'stand';
        }

        // decision == split
        // decision == double
      }
    });
  });

  // dealer decides until bust or stand
  var dealerHand = this.dealer.hands[0];
  while (dealerHand.status == 'open') {
    var decision = this.dealer.decide();

    if (decision == 'hit') {
      var card = that.shoe.getCard();
      dealerHand.deal(card);
    }

    if (decision == 'stand') {
      dealerHand.status = 'stand';
    }
  }

  that.takeChips();
  that.giveChips();

  var averageCardsPerRound = 10;
  if (that.shoe.willPenetrate(averageCardsPerRound)) {
    return that.gameOver();
  }

  that.display();

  setTimeout(function () {
    that.processRound();
  }, 100);
};

Game.prototype.display = function () {
  var table = new CLITable({
    head: [
      'player',
      'hand',
      'value',
      'status',
      'balance'
    ]
  });

  table.push([
    'Dealer',
    this.dealer.hands[0],
    this.dealer.hands[0].getValue(),
    this.dealer.hands[0].status,
    this.dealer.balance
  ]);

  this.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    table.push([
      player.name,
      player.hands[0],
      player.hands[0].getValue(),
      player.hands[0].status,
      player.balance
    ]);
  });

  console.log(this.round);
  console.log(table.toString());
};

Game.prototype.deal = function () {
  var that = this;
  var card;

  // for all players create new hand
  that.players.forEach(function (player) {
    var hand = new Hand();
    var bet = player.bet();
    hand.bet = bet;
    player.balance -= bet;

    player.hands = [
      hand
    ];
  });

  // for all non-dealer players put card in hand
  that.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    card = that.shoe.getCard();
    player.hands[0].deal(card);
  });

  // put card in dealer hand (facedown)
  card = that.shoe.getCard();
  that.dealer.hands[0].deal(card);

  // for all non-dealer players put card in hand
  that.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    card = that.shoe.getCard();
    player.hands[0].deal(card);
  });

  // put card in dealer hand (faceup)
  card = that.shoe.getCard();
  that.dealer.hands[0].deal(card);
};

Game.prototype.takeChips = function () {

};

Game.prototype.giveChips = function () {

};

Game.prototype.play = function () {
  this.paused = false;
  this.processRound();
};

Game.prototype.gameOver = function () {
  this.paused = true;
  this.done = true;
  console.log('Game over');
};

Game.prototype.getPlayerInterface = function () {
  return {
    minBet: this.minBet,
    maxBet: this.maxBet,
    getVisibleCards: function () {
      // return everything but dealer's downcard
    }
  };
};
