const StatsOnVR = require('./StatsOnVR');

//DOABLE Stagger multiple Stats panels by default.

var defaults = {
  mode: 0,
  style: "position:absolute;left:45%;top:25%;",
}

module.exports = {
  pluginE: ({config})=>{
    const ss = config('statsjs');
    window.addEventListener('load',()=>{
      ss.forEach((s)=>{
        new StatsOnVR(
          s.mode || defaults.mode,
          s.style || defaults.style);
      });
    });
  },
  windows: {
    main: {
      preloadRequires: [
        __filename
      ]
    }
  },
  statsjs: [defaults]
};
