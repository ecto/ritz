var util = require('util');
var events = require('events');
var Shoe = require('./shoe');
var Hand = require('./hand');
var Dealer = require('./players').Dealer;

var CLITable = require('cli-table');

var Game = module.exports = function Game (options) {
  this.options = options || {};
  this.shoe = null;
  this.done = false;
  this.paused = true;
  this.round = 0;
  this.speed = 0;
  this.minBet = 5;
  this.maxBet = 100;
  this.maxPlayers = 2;
  this.blackjackPays = 1.5;
  this.players = [];
  this.logger = function () {};

  events.EventEmitter.call(this);
  this.create();
};

util.inherits(Game, events.EventEmitter);

Game.prototype.create = function () {
  this.shoe = new Shoe(this.options.decksPerShoe);
  this.shoe.shuffle();

  var dealer = new Dealer();
  this.players.push(dealer);
  this.dealer = dealer;
};

Game.prototype.addPlayer = function (player) {
  if (player.balance <= 0) {
    return false;
  }

  if (~this.players.indexOf(player)) {
    return false;
  }

  this.players.push(player);
  player.game = this.getPlayerInterface();
  return true;
};

Game.prototype.processRound = function () {
  var that = this;

  // only the dealer is left,
  // it is to the house's advantage to
  // end the game and reset the shoe
  if (this.players.length == 1) {
    return this.gameOver();
  }

  that.round++;
  that.deal();

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
        var decision = player.decide(hand);

        if (decision == 'split') {
          decision = 'stand';
        }

        if (decision == 'double') {
          decision = 'hit';
        }

        if (decision == 'hit') {
          var card = that.shoe.getCard();
          hand.deal(card);
        }

        if (decision == 'stand') {
          hand.status = 'stand';
        }
      }
    });
  });

  // dealer decides until bust or stand
  var dealerHand = this.dealer.hands[0];
  while (dealerHand.status == 'open') {
    var decision = this.dealer.decide(dealerHand);

    if (decision == 'hit') {
      var card = that.shoe.getCard();
      dealerHand.deal(card);
    }

    if (decision == 'stand') {
      dealerHand.status = 'stand';
    }
  }

  that.distributeChips();

  // if the players don't have any money, kick them out
  that.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    if (player.balance == 0) {
      that.kickPlayer(player);
    }
  });

  var averageCardsPerRound = 10;
  if (that.shoe.willPenetrate(averageCardsPerRound)) {
    return that.gameOver();
  }

  that.emit('roundEnd');
  //that.logger();
  //that.display();

  setTimeout(function () {
    that.processRound();
  }, that.speed);
};

Game.prototype.kickPlayer = function (player) {
  var index = this.players.indexOf(player);

  if (~index) {
    this.players.splice(index, 1);
    this.emit('kick', player);
  }
};

Game.prototype.display = function () {
  var table = new CLITable({
    head: [
      'player',
      'hand',
      'value',
      'status',
      'balance',
      'hands played'
    ]
  });

  table.push([
    'Dealer',
    this.dealer.hands[0].toString(),
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
      player.hands[0].toString(),
      player.hands[0].getValue(),
      player.hands[0].status,
      player.balance,
      player.handsPlayed
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

    // TODO make sure bet >= minBet
    // TODO make sure bet <= maxBet

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

Game.prototype.distributeChips = function () {
  var that = this;
  var dealerHand = that.dealer.hands[0];
  var dealerBust = dealerHand.status == 'bust';
  var dealerValue = dealerHand.getValue();

  this.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    player.hands.forEach(function (hand) {
      var handValue = hand.getValue();

      // the player played before the dealer and
      // will always lose their chips if they busted
      if (hand.status == 'bust') {
        return takeChips(hand.bet);
      }

      // if the dealer busted and the player stood,
      // their bet is returned to them
      // and matched by the dealer
      // (the dealer loses
      if (dealerBust) {
        giveChips(-hand.bet, that.dealer);
        return giveChips(hand.bet * 2, player);
      }

      // the dealer has beat the hand
      // and neither have busted
      // so the dealer gets their chips
      if (dealerValue > handValue) {
        return takeChips(hand.bet);
      }

      // if the player and dealer get equal
      // hands and neither have busted,
      // player keeps the bet 1:1
      if (dealerValue == handValue) {
        return giveChips(hand.bet, player);
      }

      // the player got a blackjack
      // and beat the dealer,
      // so pay them at the table ratio
      // from the dealer's balane
      if (handValue == 21) {
        var dealerLoses = hand.bet * that.blackjackPays;
        giveChips(-dealerLoses, that.dealer);
        return giveChips(hand.bet + dealerLoses, player);
      }

      // the only other thing that could have
      // happened here is that the hand has a higher
      // value that the dealer, because the dealer
      // was forced by the rules to stand
      giveChips(-hand.bet, that.dealer);
      giveChips(hand.bet * 2, player);
    });
  });

  function takeChips (nChips) {
    that.dealer.balance += nChips;
  }

  function giveChips (nChips, player) {
    player.balance += nChips;
  }
};

Game.prototype.play = function () {
  if (this.players.length <= 1) {
    return false;
  }

  this.paused = false;
  this.processRound();
  return true;
};

Game.prototype.gameOver = function () {
  this.paused = true;
  this.done = true;
  this.emit('over');

  this.players.forEach(function (player) {
    player.gameDidEnd && player.gameDidEnd();
  });
};

Game.prototype.getPlayerInterface = function () {
  var that = this;

  return {
    minBet: that.minBet,
    maxBet: that.maxBet,

    getDealerCard: function () {
      return that.dealer.hands[0].cards[1];
    },

    getAllCards: function () {
      var cards = [];

      that.players.forEach(function (player) {
        player.hands.forEach(function (hand) {
          hand.cards.forEach(function (card) {
            cards.push(card.normalizedBlackjackValue());
          });
        });
      });

      return cards;
    }
  };
};
