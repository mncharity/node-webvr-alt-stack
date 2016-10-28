const {React, c, component} = require('./react-bare');

const Button = component('Button',{
  render () {
    const {cx,cy,r,button,className} = Object.assign({
      r: 6,
    }, this.props);

    if (!button) return React.DOM.circle({cx,cy,r,fill:'#f00'});

    const {pressed, touched} = button;

    const cls = (pressed ? 'button-pressed ' :
                 touched ? 'button-touched ' :
                 button.pressed == undefined ? 'button-disabled ' :
                 'button-default ');

    return React.DOM.circle({
      className: className+' vive-button '+cls,
      cx, cy, r,
      fill: '#888',
      stroke: '#224',
      strokeWidth: 1,
    });
  }
})

module.exports = Button;
