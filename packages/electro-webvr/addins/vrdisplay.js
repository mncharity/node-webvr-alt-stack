const { VRFrameData } = require('webvr-types-constructors');
const defaults = require('defaults');

var displays;

function init (options) {
  const opts = defaults(options,{
    presentPackage: 'vrdisplay-parts/present-simple',
    scale: 1,
  });

  const kit = require('vrdisplay-parts/create');
  const track = require('vrdisplay-parts/pose-from-gamepads').make();
  const present = require(opts.presentPackage).make({scale:opts.scale});

  const base = kit.proto();
  const factory = kit.combine(base, present, track);
  const display = factory.createVRDisplay();

  displays = [];
  displays[0] = display;

  if (typeof window != 'undefined') {
    window.navigator.getVRDisplays = getVRDisplays;
    if (factory.VRFrameData)
      window.VRFrameData = factory.VRFrameData;
  }
}

function getVRDisplays () {
  return new Promise((cb)=>{cb(displays)});
}

module.exports = {
  getVRDisplays,
  VRFrameData,

  pluginE: function ({config}) {
    return init({
      presentPackage: config("present.package"),
      scale: config("present.scale"),
    });
  },
  config: {
    windows: {
      main: {
        preloadRequires: [
          __filename
        ],
      }
    }
  },
}
