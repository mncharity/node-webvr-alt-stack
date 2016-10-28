const {createPads} = require('./gamepads');

const state = {
  pads: [],
  updateInterval: 0, // ms
}

const privateState = {
  App: null,
  lighthouseGamepads: null,
  tick: null,
}

const actions = {
  set_App (App) {
    privateState.App = App;
  },
  set_lighthouseGamepads (lighthouseGamepads) {
    privateState.lighthouseGamepads = lighthouseGamepads;
  },
  change_updateInterval (ms) {
    state.updateInterval = ms;
    clearTimeout(privateState.tick);
    if (state.updateInterval > 0)
      setTimeout(privateState.tick, 0);
  },
  _renderApp () {
    if (privateState.App) privateState.App.forceUpdate();
  },
  _updatePads () {
    privateState.lighthouseGamepads.update();
    state.pads = createPads( privateState.lighthouseGamepads.state );
  },
  _update () {
    actions._updatePads();
    actions._renderApp();
  },
}

privateState.tick = function tick () {
  if (state.updateInterval > 0) {
    actions._update();
    setTimeout(tick, state.updateInterval);
  }
}

module.exports = {
  state,
  actions
}
