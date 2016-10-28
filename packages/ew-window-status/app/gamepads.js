
function createPad (lighthouseGamepadsState,index) {
  const gamepad = lighthouseGamepadsState.gamepads[index];
  const properties = lighthouseGamepadsState.gamepadsProperties[index];
  const {
    DeviceProvidesBatteryStatus,
    DeviceBatteryPercentage,
    DeviceIsCharging,
    HasCamera,
    ModeLabel,
    SerialNumber,
    TrackingRangeMinimumMeters,
    TrackingRangeMaximumMeters,
  } = properties;
  const {
    id,
    connected,
    pose,
  } = gamepad;
  const sn = SerialNumber || "";
  const pad = {
    DeviceProvidesBatteryStatus,
    DeviceBatteryPercentage,
    DeviceIsCharging,
    HasCamera,
    ModeLabel,
    SerialNumber,
    TrackingRangeMinimumMeters,
    TrackingRangeMaximumMeters,

    id,
    connected,
    pose,

    index,
    isViveBase: false,
    isViveController: false,
    isViveHeadset: false,
  };
  //if (Math.random()<.1) console.log(gamepad);

  if (sn.match('LHB-'))
    pad.isViveBase = true;
  else if (gamepad.buttons.length > 3)
    pad.isViveController = true;
  else
    pad.isViveHeadset = true;

  if (pad.isViveHeadset) {
    pad.buttonSide = gamepad.buttons[0];
    // ignore ContainsProximitySensor - has bogus false.
    pad.buttonProximity = gamepad.buttons[1];
    //ISSUE neither ipd source changes.  My hardware broken?
    //pad.ipd = gamepad.axes[0];
    //pad.ipd = properties.UserIpdMeters;
    //console.log(gamepad.axes[0],properties.UserIpdMeters);
    pad.ipd = gamepad.axes[0];
  }
  if (pad.isViveController) {

    const bmapLighthouse = {
      System: 0,
      Menu: 1,
      Grip: 2,
      Touchpad: 3,
      Trigger: 4,
    };
    const bmapBrowser = {
      Touchpad: 0,
      Trigger: 1,
      Grip: 2,
      Menu: 3,
      System: 4,
    };
    const bmap = bmapBrowser; //FIXME ISSUE controller mapping

    const tb = gamepad.buttons[bmap.Touchpad];
    pad.buttonTouchpad = {
      pressed: tb.pressed,
      touched: tb.touched,
      x: gamepad.axes[0],
      y: gamepad.axes[1],
    };
    pad.buttonGrip = gamepad.buttons[bmap.Grip];
    pad.buttonMenu = gamepad.buttons[bmap.Menu];
    pad.buttonSystem = gamepad.buttons[bmap.System];
    pad.buttonTrigger = gamepad.buttons[bmap.Trigger];
  }
  return pad;
}

function createPads (lighthouseGamepadsState) {
  const pads = [];
  if (!lighthouseGamepadsState) return pads;
  for(var index=0;index < lighthouseGamepadsState.gamepads.length; index++) {
    if (lighthouseGamepadsState.gamepads[index])
      pads.push(createPad(lighthouseGamepadsState,index));
  }
  return pads;
}


module.exports = {
  createPads,
}
