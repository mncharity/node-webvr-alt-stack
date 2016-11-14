const camera = require('vive-camera-stream');

function presentCamera (footer,back,distance) {
  if (back) {
    const divL = document.getElementsByClassName('vrdisplay--visible-area-back vrdisplay--visible-area-left')[0];
    const divR = document.getElementsByClassName('vrdisplay--visible-area-back vrdisplay--visible-area-right')[0];
    const vidL = document.createElement('video');
    const vidR = document.createElement('video');

    vidL.style.position = vidR.style.position = 'absolute';
    vidL.style.width = vidR.style.width = '150%';
    vidL.style.left = vidR.style.right = '-25%';
    vidL.style.top = vidR.style.top = '22%';

    divL.appendChild(vidL);
    divR.appendChild(vidR);

    vidL.setAttribute('autoplay',true);
    vidR.setAttribute('autoplay',true);

    camera.getMedia().then(stream =>{
      vidL.srcObject = vidR.srcObject = stream;
    })
  }
  if (footer) {
    const divL = document.getElementsByClassName('vrdisplay--visible-area-front vrdisplay--visible-area-left')[0];
    const divR = document.getElementsByClassName('vrdisplay--visible-area-front vrdisplay--visible-area-right')[0];
    const di2L = document.createElement('div');
    const di2R = document.createElement('div');
    const di3L = document.createElement('div');
    const di3R = document.createElement('div');
    const vidL = document.createElement('video');
    const vidR = document.createElement('video');

    // How shall we crop video?
    // CSS clip: is deprecated, and clip-path: is poorly supported.
    // So we clip with di3L, and reconstruct the size of di2L in vidL.
    //DOABLE Consider adding getEyeParameters dependency and do video footer in pixels.

    di2L.style.position = di2R.style.position = 'absolute';
    di2L.style.width = di2R.style.width = '150%';
    di2L.style['padding-bottom'] = di2R.style['padding-bottom'] = 'calc(1.50 * 75%)'; // 4:3 aspect ratio
    //FIXME DEFERRED If we ever manage to get 1920x1080, the aspect ratio will be wrong.
    di2L.style.left = di2R.style.right = '-25%';
    di2L.style.top = di2R.style.top = '22%';

    const w = 0.75, h = !isNaN(parseFloat(footer)) ? footer : 0.4;
    di3L.style.overflow = di3R.style.overflow = 'hidden';
    di3L.style.position = di3R.style.position = 'absolute';
    di3L.style.width = di3R.style.width = 'calc(100% * '+w+')';
    di3L.style.height = di3R.style.height = 'calc(100% * '+h+')';
    di3L.style.left = di3R.style.right = 'calc(100% * (1 - '+w+') / 2)';
    di3L.style.top = di3R.style.top = 'calc(100% * (1 - '+h+'))';

    vidL.style.position = vidR.style.position = 'absolute';
    vidL.style.width = vidR.style.width = 'calc(100% * 1 / '+w+')';
    vidL.style.height = vidR.style.height = 'calc(100% * 1 / '+h+')';
    vidL.style.left = vidR.style.right = 'calc(100% * 1 / '+w+' * (1 - '+w+') / 2 * -1)';
    vidL.style.top = vidR.style.top = 'calc(100% * 1 / '+h+' * (1 - '+h+') * -1)';

    divL.appendChild(di2L); di2L.appendChild(di3L); di3L.appendChild(vidL);
    divR.appendChild(di2R); di2R.appendChild(di3R); di3R.appendChild(vidR);

    vidL.setAttribute('autoplay',true);
    vidR.setAttribute('autoplay',true);

    camera.getMedia().then(stream =>{
      vidL.srcObject = vidR.srcObject = stream;
    })
  }
}


module.exports = {
  pluginE({config}) {
    const cs = config('headsetCamera') || {};
    if (typeof window != 'undefined') {
      window.addEventListener("load", ()=>{ //DOABLE vrdisplaypresentchange
        presentCamera(
          cs.footer || false,
          cs.back || false,
          cs.distance || 10000); //DOABLE ignored
      });
    }
  },
  config: {
    windows: {
      main: {
        preloadRequires: [
          __filename
        ]
      }
    },
  }
}
