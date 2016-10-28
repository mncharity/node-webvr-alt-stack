const defaults = require('defaults');
const tmp = require('tmp');
const Gamepads = require('steamvr-lighthouse-driver-gamepads');

var gamepads;

function init (options) {
  const opts = defaults(options,{
    translateXYZ: {x:0,y:-2,z:0}, // Origin is base station "b".
    rotateY: 0,
    activate: false,
    local: {},
  });

  if (gamepads) return gamepads;

  const tmpd = tmp.dirSync({prefix:"driver-lighthouse--"});
  //tmpd.removeCallback(); // Prevents tmpdir deletion.
  const tmpdir = tmpd.name;

  const ot = opts.translateXYZ;
  const translate = [ot.x,ot.y,ot.z];

  const gamepadsConfig = {
    userDriverConfigDir: tmpdir,
    driverInstallDir: tmpdir,
    customizations: [
      Gamepads.customizePoseWith(translate,opts.rotateY),
      Gamepads.customizeForBrowser()
    ]
  };

  gamepads = new Gamepads(gamepadsConfig);

  if (opts.activate) gamepads.activate();

  return gamepads;
}

module.exports = {
  pluginE: function ({config,local}) {
    return init({
      translateXYZ: config("pose.translate"),
      rotateY: config("pose.rotateY"),
      activate: config("gamepads.activeOnLoad"),
      local
    });
  },
}
