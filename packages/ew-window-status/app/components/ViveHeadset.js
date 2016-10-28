const {React, c, component} = require('./react-bare');
const Button = require('./Button');

const ViveHeadset = component('ViveHeadset',{
  render () {
    const {width,pad} = this.props;
    const height = Math.round(width * .8);
    const center = ('translate('+
                    Math.round(width/2)+' '+
                    Math.round(height/2)+')');

    const rx = Math.round(width * .3);
    const ry = Math.round(rx * .67);

    const hmd = React.DOM.ellipse({
      className: 'vive-headset',
      cx:0, cy:0, rx, ry,
      fill: '#000'
    });

    const br = rx * .3;
    const side = c(Button,{
      cx: rx,
      cy: 0,
      r: br,
      button:pad.buttonSide});
    const proximity = c(Button,{
      cx: 0,
      cy: -ry*.8,
      r: br,
      button:pad.buttonProximity});

    const ipdStr = pad.ipd ? (pad.ipd * 1000).toFixed(1) : "??.?";
    const ipd = React.DOM.text({
      className: 'vive-headset-ipd-text',
      x: -rx -12,
      y: +ry +6,
      fontFamily: 'Verdana',
      fontSize: 12,
      fill: '#880',
      }, ipdStr);

    const ky = ry*.7;
    const ipdKnob = React.DOM.line({
      className: 'vive-headset-ipd-knob',
      x1: -rx*.7,
      x2: -rx*1.0,
      y1: ky,
      y2: ky,
      stroke: '#aaf',
      strokeWidth: rx * .15,
      });

    const cls = (pad.HasCamera ?
                 'camera-enabled' :
                 'camera-disabled');
    const w=10;
    const camera = React.DOM.rect({
      className: 'vive-headset-camera '+cls,
      x: -w/2,
      y: ry*.8-w/2,
      width: w,
      height: w,
      fill: '#a00',
      stroke: '#000',
      strokeWidth: 1
    });

    return React.DOM.svg(
      {width,height},
      React.DOM.g(
        {transform: center},
        ipdKnob, hmd, ipd,
        side, proximity, camera));
  }
})

module.exports = ViveHeadset;
