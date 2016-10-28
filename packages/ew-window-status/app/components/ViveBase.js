const {React, c, component} = require('./react-bare');

const ViveBase = component('ViveBase',{
  render () {
    const {width,pad} = this.props;
    const height = Math.round(width * 1);
    const center = ('translate('+
                    Math.round(width/2)+' '+
                    Math.round(height/2)+')');

    const w = width *.7;
    const box = React.DOM.rect({
      className: 'vive-base-box',
      width: w,
      height: w,
      x: -w/2,
      y: -w/2,
      rx: w/8,
      ry: w/8,
      fill: '#000',
    });

    var letterSize = Math.round(w > 75 ? w*.2 : w > 20 ? 15 : w > 2 ? w - 2 : w);
    var letterStr = pad.ModeLabel || '?';
    var letter = React.DOM.text({
      className: 'vive-base-mode',
      x: -w*.4 + letterSize *.13,
      y:  w*.4 - letterSize *.5,
      fontFamily: 'Verdana',
      fontSize: letterSize,
      fill: '#afa',
    }, letterStr);

    return React.DOM.svg(
      {width,height},
      React.DOM.g(
        {transform: center},
        box, letter));
  }
})

module.exports = ViveBase;
