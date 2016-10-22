const { ipcRenderer, remote } = require('electron');
const findViveDisplay = require('./findViveDisplay');

var boundsOnDesktop = null;
var isOnDesktop = true;

function placeWindowOn (hmd) {
  if (hmd && isOnDesktop) {
    var vive = findViveDisplay(remote.screen);
    if (vive) {
      boundsOnDesktop = remote.getCurrentWindow().getBounds();      
      remote.getCurrentWindow().setBounds({
        x: vive.x +30,
        y: vive.y +30,
        width: boundsOnDesktop.width,
        height: boundsOnDesktop.height
      });
      remote.getCurrentWindow().setFullScreen(true);
      isOnDesktop = false;
    }
    else
      console.log("Can't move window to HMD: didn't find a Vive-sized display.")
  }
  else if (!hmd && !isOnDesktop) {
    remote.getCurrentWindow().setFullScreen(false);
    remote.getCurrentWindow().setBounds(boundsOnDesktop);
    isOnDesktop = true;
  }
}

ipcRenderer.on('hmd-window-show-on-hmd', (e,onHMD)=>{
  placeWindowOn(onHMD);
});
