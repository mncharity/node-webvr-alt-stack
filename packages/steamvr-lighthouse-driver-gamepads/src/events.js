
//ISSUE: I don't know how to deal with GamepadEvent.
// As of 2016-10, we can neither use the existing GamepadEvent, nor create a new one.
// The chromium GamepadEvent constructor only accepts chromium native Gamepad objects.
// And the window.GamepadEvent or window.Event prototypes don't support inheritance.

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
