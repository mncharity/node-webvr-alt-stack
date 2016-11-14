const Stats = require('stats.js');

class StatsOnVR {
  constructor ( mode, style ) {
    this.stats = new Stats();
    this.stats.showPanel( mode );// 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.style = style;
    this.placePanel = (()=>{
      var parent = document.getElementsByClassName('vrdisplay--visible-area-left vrdisplay--visible-area-front')[0];
      if (!parent) parent = document.body;
      parent.appendChild( this.stats.dom );
    }).bind(this);
    const update = (()=>{
      if (!this.stats) return;
      this.stats.update();
      requestAnimationFrame(update);
    }).bind(this);
    this.placePanel();
    update();
    window.addEventListener('vrdisplaypresentchange',this.placePanel);
  }
  shutdown () {
    window.removeEventListener('vrdisplaypresentchange',this.placePanel);
    this.stats = null;
  }
}

module.exports = StatsOnVR;
