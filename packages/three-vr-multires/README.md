This module helps one create low-quality light-weight three.js WebVR pages.  It handles cameras and rendering, giving each eye a low-resolution background and a high-resolution center.  I use it on the road to run custom pages on an HTC Vive, on an old laptop's integrated graphics.  It is unlikely to be of much other use.

It has only been tested with electro-webvr.  It requires a WebVR requestPresent() which accepts a DOM layer.

Performance on the cubes example is now down to below 30 fps on my laptop's Intel HD Graphics 520 (circa 2015).  I'm ok with that, but YMMV.  I've not profiled the current code.

## Demo

    npm start

## Usage

    //const Multires = require('three-vr-multires');
    const Multires = window.VRMultiRes;

    const scales = {
      scale: .25,
      scaleOfCenter: 2,
    };

    var vrdisplay, multires, renderer, scene, eyes;

    function getDisplay (cb) {
      navigator.getVRDisplays().then( displays =>{
        vrdisplay = displays[0];
        cb();
      });
    }

    function init () {
      const {offset, fieldOfView, renderWidth, renderHeight} =
        vrdisplay.getEyeParameters("left");

      multires = Object.assign({},Multires,scales,{
        ipd: -2 * offset[0],
        renderWidth,
        renderHeight,
        fieldOfView,
      }).init();

      // optionally tweak cameras
      multires.cameras[0].layers.enable(1); // L low-res
      multires.cameras[2].layers.enable(1); // L  hi-res
      multires.cameras[1].layers.enable(2); // R low-res
      multires.cameras[3].layers.enable(2); // R  hi-res

      renderer = new THREE.WebGLRenderer({
        canvas: multires.rendererCanvas,
        antialias: true,
      });
      renderer.autoClear = false;

      eyes = multires.eyes;

      scene = new THREE.Scene();
      scene.add(eyes);

      present();
    }

    function present () {
      vrdisplay.requestPresent([{source:multires.domElement}]);
    }

    function render () {
      const pose = vrdisplay.getPose();
      if (pose && pose.position) eyes.position.set(...pose.position);
      if (pose && pose.orientation) eyes.quaternion.set(...pose.orientation);
      multires.render(renderer,scene);
    }
