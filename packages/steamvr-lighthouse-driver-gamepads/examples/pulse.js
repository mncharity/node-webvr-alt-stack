var Gamepads = require('../');
var gamepads = new Gamepads();

gamepads.activate();
gamepads.getGamepads();

const logPrefix = ">>>> ";
const max = 3.9;
const min = .0005;
const step = .2; // step and val are log10
var val = Math.log10(max) + step;  // one step above max
function tick () {
  const duration = Math.pow(10,val);
  console.log(logPrefix,"HapticPulse duration: ",duration.toFixed(4)," ms");
  gamepads.getGamepads().forEach( gamepad =>{
    if (gamepad && gamepad.hapticActuators) {
      const ha = gamepad.hapticActuators[0].pulse(undefined,duration);
    }
  });
  val -= step;
  if (Math.pow(10,val) >= min) setTimeout(tick,800);
}
setTimeout(()=>{
  gamepads.getGamepads();
  console.log(logPrefix);
  console.log(logPrefix,"gamepads with hapticActuators: ",
              gamepads.getGamepads().filter(gamepad=>{
                return gamepad && gamepad.hapticActuators}));
  console.log(logPrefix,"Useful values are roughly 3.9 to 0.0016 us");
  tick();
},2000);
