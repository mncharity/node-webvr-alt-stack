const { GamepadHapticActuator } = require('webvr-types-constructors')

//ISSUE GamepadHapticActuatorType "vibrate" is inappropriate for Vive controller
// https://w3c.github.io/gamepad/extensions.html 2016-10-29
// defines only one GamepadHapticActuatorType:
//   vibration - Vibration is a rumbling effect often implemented as an
//   offset weight driven on a rotational axis. The value of a vibration
//   force determines the frequency of the rumble effect and is
//   normalized between 0.0 and 1.0. The neutral value is 0.0.
// That isn't what the Vive controller does.
// It's does discrete impulses.

//ISSUE this "impulse" GamepadHapticActuator API completely non-spec.

function createActuator (device,axisIndex) {
  const actuator = new GamepadHapticActuator();
  actuator.type = "x-impulse";
  actuator.pulse = function pulse (value, duration) {
    // VALUE: ignored.
    // DURATION: Useful durations are roughly .001 to 3.9 (ms).
    //   Above and below are silent.
    //   Basically, 1 is loud, .1 normal, .01 quiet.
    // Invocation intervals: 1 ms screech, 10 ms buzz, 100 ms rattle, 1 s pop.
    const pulseDurationMicroseconds = duration * 1000;
    device.triggerHapticPulse(axisIndex, pulseDurationMicroseconds);
    return new Promise(cb => {
      //FIXME fudged gamepad pulse() Promise
      //spec: The returned promise will resolve true once the pulse has completed.
      //spec: Repeated calls to pulse() override the previous values. 
      //TODO flag spec ambiguity re pulse "completed" wrt overrides?
      //Fortunately, for Vive it's a rare case.
      setTimeout(()=>{
        cb(true);
      }, duration);
    });
  };
  return actuator;
}

function setHaptics (gamepad,device) {
  if (device.controllerState) {
    const ha = [
      createActuator(device,0)
    ];
    gamepad.hand = "";
    gamepad.hapticActuators = ha;
  }
}


module.exports = {
  setHaptics
}
