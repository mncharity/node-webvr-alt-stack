const { ipcRenderer, remote } = require('electron');
const findViveDisplay = require('./findViveDisplay');

var isOnDesktop = true;
var boundsOnDesktop = null;
var wasAlwaysOnTop = false;

// We setAlwaysOnTop because I saw a merely setFullScreen window flicking
// with unnecessary redraws on stock Ubuntu 16.04 in 2016-10.
// Maybe compiz was confused by the task bar?

function moveCurrentWindow (wantOnHMD) {
  if (wantOnHMD && isOnDesktop) {
    var vive = findViveDisplay(remote.screen);
    if (vive) {
      boundsOnDesktop = remote.getCurrentWindow().getBounds();      
      remote.getCurrentWindow().setBounds({
        x: vive.x +30,
        y: vive.y +30,
        width: boundsOnDesktop.width,
        height: boundsOnDesktop.height
      });
      const win = remote.getCurrentWindow();
      wasAlwaysOnTop = win.isAlwaysOnTop();
      win.setAlwaysOnTop(true);
      win.setFullScreen(true);
      isOnDesktop = false;
    }
    else
      console.log("Can't move window to HMD: didn't find a Vive-sized display.")
  }
  else if (!wantOnHMD && !isOnDesktop) {
    const win = remote.getCurrentWindow();
    win.setFullScreen(false);
    win.setAlwaysOnTop(wasAlwaysOnTop);
    win.setBounds(boundsOnDesktop);
    isOnDesktop = true;
  }
}

ipcRenderer.on('hmd-window-show-on-hmd', (e,wantOnHMD)=>{
  moveCurrentWindow(wantOnHMD);
});
