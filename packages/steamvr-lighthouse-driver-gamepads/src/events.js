
// var Parent = typeof window != 'undefined' ? (window.GamepadEvent || window.Event) : Object;
// function GamepadEventLighthouse () {
//   var gamepad = arguments[arguments.length-1];
//   Parent.call(this,arguments);
//   if (! this.gamepad) this.gamepad = gamepad;
// }
// // Object.assign({},GamepadEvent.prototype) => TypeError: Illegal invocation
// // Object.assign({},Event.prototype) => TypeError: Illegal invocation
// // Object thus likely unhelpful.
// GamepadEventLighthouse.prototype = Object.assign({},window.Event.prototype,{
//   constructor: GamepadEventLighthouse
// });

function emit (name,gamepad,window_opt) {
  var win = window_opt || (typeof window != 'undefined' && window);
  if (!win) return;
  var event;
  // Chromium GamepadEvent constructor only accepts chromium Gamepad objects.  It's 2016.
  if (false && win.GamepadEvent) {
    event = new win.GamepadEvent(name,gamepad);
  }
  else if (false) { // Chromium "TypeError: Illegal invocation"
    event = new GamepadEventLighthouse(name,gamepad);
  }
  else {
    event = new win.Event(name);
    event.gamepad = gamepad; //TODO any PIC poisoning performance impact?  
  }
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
//  GamepadEvent: GamepadEventLighthouse
}
