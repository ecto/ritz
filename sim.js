var ritz = require('./lib')();
var Table = ritz.Table;
var Player = ritz.players.Base;
var SmartPlayer = ritz.players.SmartPlayer;

var CLITable = require('cli-table');
var charm = require('charm')();
charm.on('^C', process.exit);
charm.pipe(process.stdout);
charm.reset();

var player = new Player();
player.name = 'Alice';
player.balance = 10000;

var player2 = new SmartPlayer();
player2.name = 'Bob';
player2.balance = 10000;

var table = new Table();
table.logger = logger;
player.join(table);
player2.join(table);

function logger () {
  var clitable = new CLITable({
    head: [
      'player',
      'hand',
      'value',
      'status',
      'balance',
      'hands played'
    ],
    colWidths: [
      10,
      20,
      10,
      10,
      10,
      10
    ]
  });

  clitable.push([
    'Dealer',
    table.game.dealer.hands[0].toString(),
    table.game.dealer.hands[0].getValue(),
    table.game.dealer.hands[0].status,
    table.game.dealer.balance,
    table.game.round
  ]);

  table.game.players.forEach(function (player) {
    if (player.isDealer) {
      return;
    }

    clitable.push([
      player.name,
      player.hands[0].toString(),
      player.hands[0].getValue(),
      player.hands[0].status,
      player.balance,
      player.handsPlayed
    ]);
  });

  charm.position(0, 0);
  charm.write(clitable.toString());
  charm.position(0, 0);
  charm.write(table.gameCount.toString());

/*
var dealerShouldHave = 0;
table.players.forEach(function (player) {
  if (player.isDealer) {
    return;
  }

  dealerShouldHave += (10000 - player.balance);
});
charm.position(63, 4);
charm.write(dealerShouldHave + ' expected');
*/
}
