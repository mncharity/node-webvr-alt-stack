var prettyjson = require('prettyjson');
var driver = require('../');

var repeats = 100;
function sample () {
  driver.update();
  if (repeats % 10 == 0) {
    console.log("\n\n");
    console.log("[");
    driver.devices.map(function(e){
      console.log(JSON.stringify(e,null,4),",");
    });
    console.log("]");
    console.log();
  }
  repeats--;
  if (repeats>0) setTimeout(sample,500);
  else driver.shutdown();
}
sample();
 

