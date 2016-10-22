const tmp = require('tmp');
const Gamepads = require('steamvr-lighthouse-driver-gamepads');
const { VRFrameData } = require('webvr-types-constructors');

var gamepads;
var displays;

function init (options) {
  const opts = Object.assign({
    presentPackage: 'vrdisplay-parts/present-simple',
    scale: 1,
    translateXYZ: {x:0,y:-2,z:0}, // Origin is base station "b".
    rotateY: 0,
    activate: false,
    local: {},
  },options);

  // init Display

  const kit = require('vrdisplay-parts/create');
  const track = require('vrdisplay-parts/pose-from-gamepads').make();

  const simple = require(opts.presentPackage).make({scale:opts.scale});
  const base = kit.proto();
  const factory = kit.combine(base, simple, track);
  const display = factory.createVRDisplay();

  displays = [];
  displays[0] = display;

  // init Gamepads

  const tmpd = tmp.dirSync({prefix:"driver-lighthouse--"});
  //tmpd.removeCallback(); // Prevents tmpdir deletion.
  const tmpdir = tmpd.name;

  const ot = opts.translateXYZ;
  const translate = [ot.x,ot.y,ot.z];

  const gamepadsConfig = {
    userDriverConfigDir: tmpdir,
    driverInstallDir: tmpdir,
    customizations: [
      Gamepads.customizePoseWith(opts.rotateY,translate),
      Gamepads.customizeForBrowser()
    ]
  };

  gamepads = new Gamepads(gamepadsConfig);
  if (opts.activate) gamepads.activate();

  // inject into window

  opts.local.gamepads = gamepads;

  if (typeof window != 'undefined') {
    window.navigator.getGamepads = getGamepads;
    window.navigator.getVRDisplays = getVRDisplays;
    if (factory.VRFrameData)
      window.VRFrameData = factory.VRFrameData;
  }
}

function getVRDisplays () {
  return new Promise((cb)=>{cb(displays)});
}

function getGamepads () {
  return gamepads.getGamepads();
};


module.exports = {
  getVRDisplays,
  VRFrameData,
  getGamepads,

  pluginE: function ({config,local}) {
    init({
      presentPackage: config("present.package"),
      scale: config("present.scale"),
      translateXYZ: config("pose.translate"),
      rotateY: config("pose.rotateY"),
      activate: config("gamepads.activeOnLoad"),
      local
    });
  },
  _init: init,
  config: {
    windows: {
      main: {
        preloadRequires: [
          __dirname+"/webvr"
        ],
      }
    }
  },
}
