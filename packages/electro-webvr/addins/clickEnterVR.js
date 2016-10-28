function enterVR () {
  const $ = require('jquery');

  // 2016-10 three.js r81 examples/js/WebVR.js
  $('button:contains("ENTER VR")').trigger("click");

  //TODO aframe?  what else?
}

module.exports = {
  pluginE() {
    if (typeof window != 'undefined') {
      window.addEventListener("load", enterVR);
    }
  },
  config: {
    windows: {
      main: {
        preloadRequires: [
          __filename
        ]
      }
    }
  }
}
