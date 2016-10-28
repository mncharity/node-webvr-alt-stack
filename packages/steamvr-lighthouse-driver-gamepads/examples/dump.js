var prettyjson = require('prettyjson');
var Gamepads = require('../');
var gamepads = new Gamepads();

var window_navigator = {};
window_navigator.getGamepads = function getGamepads () {
  return gamepads.getGamepads();
};

console.log(window_navigator.getGamepads());
gamepads.activate();

var repeats = 50;
function sample () {
  if (true) {
    console.log("\n\n------------------------------------------\n\n");
    console.log(prettyjson.render(window_navigator.getGamepads()));
    //console.log(gamepads.gamepadsProperties);
    console.log();
  }
  repeats--;
  if (repeats>0) setTimeout(sample,5000);
}
sample();
