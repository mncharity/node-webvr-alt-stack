const { ipcRenderer } = require('electron')
const channels = require('./channels')
const driver = require('./driver')

var gp;

const lighthouseGamepads = {
  state: undefined,
  update: function () {
    gp.getGamepads();
    this.state = {
      devices: gp.devices,
      gamepads: gp.gamepads,
      gamepadsProperties: gp.gamepadsProperties,
    };
  }
}
function getGamepads () {
  lighthouseGamepads.update();
  return lighthouseGamepads.state.gamepads;
}

if (ipcRenderer) {// undefined in tests
  ipcRenderer.on(channels.serverRequest, (event)=>{
    lighthouseGamepads.update();
    const json = JSON.stringify(lighthouseGamepads.state);
    ipcRenderer.send(channels.serverResponse, json);
  });
  ipcRenderer.on(channels.pulseRequest, (event,data)=>{
    const {index,idx,value,duration} = data;
    lighthouseGamepads.state.gamepads[index].hapticActuators[idx].pulse(value,duration);
  });
}

module.exports = {
  pluginE: function ({config,local}) {
    gp = driver.pluginE({config,local});
    local.lighthouseGamepads = lighthouseGamepads;
    if (typeof window != 'undefined')
      window.navigator.getGamepads = getGamepads;
  },
}
