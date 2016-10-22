const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');

function preloadRequires_setup (w,window) {
  const channel = 'request-preload-requires';
  const responder = (e)=>{
    if (e.sender == window.webContents) {
      e.returnValue = {
        requires: w.preloadRequires || [],
      };
      // cleanup(); //ISSUE page navigation?
    };
  };
  const cleanup = ()=>{
    ipcMain.removeListener(channel, responder);
  };
  window.on('close', cleanup);
  ipcMain.on(channel, responder);
}

function setup (windowsSpec) {
  var state = {};
  for (var id in windowsSpec) {
    const w = windowsSpec[id];

    const options = Object.assign({},w.optionsForBrowserWindow);
    options.webPreferences = Object.assign({},options.webPreferences);

    // Change the nodeIntegration default to false.  CRITICAL.
    if (options.webPreferences.nodeIntegration == undefined)
      options.webPreferences.nodeIntegration = false;
      
    if (!options.webPreferences.preload)
      options.webPreferences.preload = __dirname+"/../src/preload.js";
    
    var rWP;
    if (w.rememberWindowPosition || w.rememberWindowPosition == undefined) {
      rWP = windowStateKeeper({
        file: "window-state-"+id+".json",
        defaultWidth: options.width || 800,
        defaultHeight: options.height || 600,
      });
      options.x = rWP.x;
      options.y = rWP.y;
      options.width = rWP.width;
      options.height = rWP.height;
    }
 
    var window = new BrowserWindow(options);
    window.on('close',()=>{window = null});
    if (rWP) rWP.manage(window);
    if (w.quitOnClose) window.on('close',()=>{app.quit()});
    if (w.devtools) window.webContents.openDevTools();

    //Not if (w.preloadRequires), because everyone gets the prelude.
    //TODO make async
    preloadRequires_setup(w,window);

    if (w.url) window.loadURL(w.url);

    state[id] = {
      id,
      window,
    };
  }
  global.state.windows = state;
};

module.exports = {
  pluginE: function ({config}) {
    setup(config('windows'));
  },
}
