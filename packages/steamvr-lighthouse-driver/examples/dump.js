var prettyjson = require('prettyjson');
var driver = require('../');

var repeats = 100;
function sample () {
  driver.update();
  if (repeats % 10 == 0) {
    console.log("\n\n------------------------------------------\n\n");
    console.log(prettyjson.render(driver.devices));
    console.log();
  }
  repeats--;
  if (repeats>0) setTimeout(sample,500);
  else driver.shutdown();
}
sample();
 

