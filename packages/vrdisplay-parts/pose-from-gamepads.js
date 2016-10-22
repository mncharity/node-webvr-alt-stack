const { VRPose } = require('webvr-types-constructors')

function findGamepad (gamepads) {
  var haveHMD = null;
  var haveOther = null;
  gamepads.forEach(function(gamepad){
    if (gamepad && gamepad.pose) {
      var nbuttons = gamepad.buttons.length;
      var hmdLike = nbuttons > 0 && nbuttons < 3;
      var notBase = nbuttons > 0;
      var tracking = gamepad.pose.position;
      if (hmdLike) {
        if (!haveHMD || (tracking && !haveHMD.pose.position))
          haveHMD = gamepad;
      }
      else if (notBase && tracking) {
        if (!haveOther)
          haveOther = gamepad;
      }
    }
  });
  var hmdIsTracked = haveHMD && haveHMD.pose.position;
  var otherIsTracked = haveOther && haveOther.pose.position
  var trackedAnything = (hmdIsTracked ? haveHMD :
                         otherIsTracked ? haveOther :
                         null);
  var gamepad = trackedAnything || haveHMD || haveOther || null;
  return gamepad;
}

module.exports = {
  make: function (opts) {
    var options = Object.assign({},{
    },opts);
    return {
      getPose: function () {
        var gamepads = (typeof window != 'undefined'
                        ? window.navigator.getGamepads()
                        : []);
        var found = findGamepad(gamepads);
        if (found && found.pose) return found.pose;
        return new VRPose(null, null, null, null, null, null);
      }
    };
  },
  findGamepad
};
