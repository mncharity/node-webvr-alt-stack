const { ipcRenderer } = require('electron')
const { loadModules } = require('./loadModules')

var {requires} = ipcRenderer.sendSync('request-preload-requires');

loadModules(requires);
