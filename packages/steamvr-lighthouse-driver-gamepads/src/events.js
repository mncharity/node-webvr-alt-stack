
//ISSUE: I don't know how to deal with GamepadEvent.
// As of 2016-10,
// We can neither use the existing GamepadEvent, nor create a new one.
//
// The chromium GamepadEvent constructor only accepts chromium Gamepad objects.
// Can't create window.GamepadEvent's with non-native Gamepad-like objects.
//
//   event = new win.GamepadEvent(name,gamepad);
//
// And can't use the window.GamepadEvent or window.Event prototypes.
//
//   var Parent = typeof window != 'undefined' ? (window.GamepadEvent || window.Event) : Object;
//   function GamepadEventLighthouse () {
//     var gamepad = arguments[arguments.length-1];
//     Parent.call(this,arguments);
//     if (! this.gamepad) this.gamepad = gamepad;
//   }
//   GamepadEventLighthouse.prototype = Object.assign({},window.Event.prototype,{
//     constructor: GamepadEventLighthouse
//   });
// but...
//   Object.assign({},GamepadEvent.prototype) //=> TypeError: Illegal invocation
//   Object.assign({},Event.prototype) //=> TypeError: Illegal invocation
//
// Chromium is still using badly-mocked psuedo-objects.
// Likely a WONTFIX, but sigh.  "We implement the fast path, and call it done."


function emit (name,gamepad,window_opt) {
  var win = window_opt || (typeof window != 'undefined' && window);
  if (!win) return;
  const event = new win.Event(name);
  event.gamepad = gamepad; //TODO any PIC poisoning performance impact?
  if (win.dispatchEvent)
    win.dispatchEvent(event);
}


function emit_gamepadconnected (gamepad,window) {
  emit('gamepadconnected',gamepad,window);
}
function emit_gamepaddisconnected (gamepad,window) {
  emit('gamepaddisconnected',gamepad,window);
}

module.exports = {
  emit_gamepadconnected,
  emit_gamepaddisconnected,
}
