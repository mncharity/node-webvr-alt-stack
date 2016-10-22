const driver = require('steamvr-lighthouse-driver')
const { EVRControllerAxisType, EVRButtonId } = driver.openvr;

function GamepadButtonLighthouse () {
  this.pressed = false;
  this.touched = false;
  this.value = 0.0;
}

function setButtonsAndAxes (gamepad,device) {
  var buttons = [];
  var axes = [];

  if (device.controllerState) {
    // Axes
    var maxAxis = 4;
    var rAxis = device.controllerState.rAxis;
    var types = [];
    var valueOf_SteamVR_Trigger = undefined;
    for(var n=0; n <= maxAxis; n++) {
      var k = "Axis"+n+"Type";
      types[n] = device.properties[k];
    }
    for(var n=0; n <= maxAxis; n++) {
      if (types[n] == EVRControllerAxisType.TrackPad) {
        axes.push( rAxis[n].x );
        axes.push( rAxis[n].y );
      }
      else if (types[n] == EVRControllerAxisType.Joystick) {
        //TODO: find someone with a Joystick to test.
        axes.push( rAxis[n].x );
        axes.push( rAxis[n].y );
      }
      else if(types[n] == EVRControllerAxisType.Trigger) {
        if (n == 1) {
          // Expose SteamVR_Trigger aka Axis1 as WebVR button.value, not an axis.
          valueOf_SteamVR_Trigger = rAxis[n].x;
        } else {
          axes.push( rAxis[n].x );
        }
      }
      else {
        //DOABLE: log unknown type
      }
    }
    // Buttons
    var dprops = device.properties;
    var cstate = device.controllerState;
    if (dprops.SupportedButtonsLO || dprops.SupportedButtonsHI) {
      for(var n=0; n < 64; n++) {
        var i = (n < 32 ? n : n - 31) - 1;
        var supported = n < 32 ? dprops.SupportedButtonsLO : dprops.SupportedButtonsHI;
        if (supported & (1 << i)) {
          var pressed = n < 32 ? cstate.ulButtonPressedLO : cstate.ulButtonPressedHI;
          var touched = n < 32 ? cstate.ulButtonTouchedLO : cstate.ulButtonTouchedHI;
          var b = new GamepadButtonLighthouse();        
          b.pressed = pressed & (1 << i) ? true : false;
          b.touched = touched & (1 << i) ? true : false;
          b.value = 0;
          if (n == EVRButtonId.SteamVR_Trigger) b.value = valueOf_SteamVR_Trigger;
          if (b.pressed) b.value = 1; // WebVR invariant
          buttons.push(b);
        }
      }
    }
  }
  else if (device.properties && device.properties.SerialNumber &&
           device.properties.SerialNumber.match('^LHR-')) {

    // HTC Vive HMD has a headset button, but doesn't expose controllerState.
    var b = new GamepadButtonLighthouse();        
    b.pressed = undefined;
    if (device.extras) {
      b.pressed = device.extras.ulButtonPressedLO & (1 << 0);
    }
    b.touched = b.pressed;
    b.value = b.pressed ? 1 : 0;
    buttons.push(b);

    // HTC Vive HMD has a proximity sensor.  Even if my Props claims not.
    if (1) {
      var b = new GamepadButtonLighthouse();
      b.pressed = undefined;
      if (device.extras) {
        b.pressed = device.extras.bProximitySensorTriggered;
      }
      b.touched = b.pressed;
      b.value = b.pressed ? 1 : 0;
      buttons.push(b);
    }
  }
  gamepad.buttons = buttons;
  gamepad.axes = axes;         
}

module.exports = {
  setButtonsAndAxes
}
