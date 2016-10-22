
const ETrackingResult = {
  Uninitialized: 1,
  Calibrating_InProgress: 100,
  Calibrating_OutOfRange: 101,
  Running_OK: 200,
  Running_OutOfRange: 201,
};

const EVRControllerAxisType = {
  TrackPad: 1,
  Joystick: 2,
  Trigger: 3,
};
const EVRButtonId = {
  System: 0,
  ApplicationMenu: 1,
  Grip: 2,
  DPad_Left: 3,
  DPad_Up: 4,
  DPad_Right: 5,
  DPad_Down: 6,
  A: 7,

  Axis0: 32,
  Axis1: 33,
  Axis2: 34,
  Axis3: 35,
  Axis4: 36,
};
EVRButtonId.SteamVR_Touchpad = EVRButtonId.Axis0;
EVRButtonId.SteamVR_Trigger = EVRButtonId.Axis1;
EVRButtonId.Dashboard_Back = EVRButtonId.Grip;

module.exports = {
  ETrackingResult,
  EVRControllerAxisType,
  EVRButtonId,
};
