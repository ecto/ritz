var util = module.exports = {};

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
util.shuffle = function fisherYates (arr) {
  var counter = arr.length;
  var temp;
  var index;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

util.cardsToString = function (cards) {
  var ret = [];

  cards.forEach(function (card) {
    ret.push(card.toString());
  });

  return ret.join('\n');
};

