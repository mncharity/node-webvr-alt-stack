
module.exports = {
  pluginE ({local}) {
    const {actions} = require('./app/app');
    actions.set_lighthouseGamepads(local.lighthouseGamepads);
  },
  config: {
    windows: {
      status: {
        optionsForBrowserWindow: {
          title: "Status",
          width: 600,
          height: 420,
          webPreferences: {
            nodeIntegration: true, //for require() //DOABLE browserify
          },
        },
        url: 'file:'+__dirname+"/app/index.html",
        preloadRequires: [
          __filename
        ],
        quitOnClose: true,
        devtools: true,
      }
    }
  }
}
