const { ipcRenderer } = require('electron')
const channels = require('./channels')

const lighthouseGamepads = {
  state: undefined,
  update: function () {
    const res = ipcRenderer.sendSync(channels.clientRequest);
    this.state = JSON.parse(res);
  }
}
function getGamepads () {
  lighthouseGamepads.update();
  return lighthouseGamepads.state.gamepads;
}

module.exports = {
  pluginE: function ({local}) {
    local.lighthouseGamepads = lighthouseGamepads;
    window.navigator.getGamepads = getGamepads;
  },
}
