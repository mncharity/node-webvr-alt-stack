const {React, c, component} = require('./react-bare');

const Battery = component('Battery',{
  render () {
    const {cx,cy,width,height,chargePercent,isCharging,className} = this.props;
    const center = 'translate('+cx+' '+cy+')';

    const chargeIsKnown = !!chargePercent;
    const charge = chargeIsKnown ? chargePercent : 1;

    var cls = 'battery-charge-level ';
    if (!chargeIsKnown)
      cls += 'battery-charge-unknown';
    else if (charge > .5)
      cls += 'battery-charge-gt-50';
    else if (charge > .25)
      cls += 'battery-charge-gt-25';
    else
      cls += 'battery-charge-low';

    const level = React.DOM.rect({
      className: cls,
      width: charge*width,
      height,
      x: -width/2,
      y: -height/2,
    });

    const color = isCharging ? '#0a0' : '#000';
    const box = React.DOM.rect({
      className: 'battery-frame',
      width,
      height,
      x: -width/2,
      y: -height/2,
      fill: '#aaa',
      stroke: color,
      strokeWidth: 1,
    });

    return React.DOM.g({
      className,
      transform: center,
    }, box, level);
  }
})

module.exports = Battery;
