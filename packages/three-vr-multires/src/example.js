if(true){
  if(true){//{ match indentation of README.md Usage

    function setup (cb) {
      const whenHaveDisplay = ()=>{
        init();
        cb({
          camera: multires.cameras[0],
          scene,
          renderer,
        });
      };
      getDisplay(whenHaveDisplay);
    }

    //{ start of README.md Usage

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
        alpha: window.location.href.search("alpha:true") >=0,
      });
      renderer.autoClear = false;

      eyes = multires.eyes;

      scene = new THREE.Scene();
      scene.add(eyes);

      present();
    }

    function present () {
      vrdisplay.requestPresent([{source:multires.domElement}]);
      // Do not include in README.md Usage.
      // To see the entire canvas for debugging,
      // comment out requestPresent, and uncomment the following:
      //const canvas = document.body.appendChild(multires.domElement.childNodes[0])
      //canvas.style.width = '500px';
      //canvas.style.height = '500px';
    }

    function render () {
      const pose = vrdisplay.getPose();
      if (pose && pose.position) eyes.position.set(...pose.position);
      if (pose && pose.orientation) eyes.quaternion.set(...pose.orientation);
      multires.render(renderer,scene);
    }

    //} end of README.md Usage

    window.MultiresExample = {
      setup,
      render,
    }

  }
}
