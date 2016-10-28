const {React, c, component} = require('./react-bare');
const ViveBase = require('./ViveBase');
const ViveController = require('./ViveController');
const ViveHeadset = require('./ViveHeadset');

function someViveThing (props) {
  const {pad} = props;
  if (pad.isViveBase)
    return c(ViveBase,props);
  if (pad.isViveController)
    return c(ViveController,props);
  if (pad.isViveHeadset)
    return c(ViveHeadset,props);
  return null;
}


const InputStatus = component('InputStatus',{
  render () {
    const {pad,width} = this.props;
    const cls = (pad.connected
                 ? 'gamepad-is-connected '
                 : 'gamepad-is-disconnected ');
    const cls2 = ((pad.pose && pad.pose.position != null)
                  ? 'gamepad-pose-is-valid '
                  : 'gamepad-pose-is-invalid ');
    return React.DOM.div({
      className: 'gamepad-input-status-wrapper '+cls+cls2
    }, someViveThing(this.props));
  }
})

const AllInputStatus = component('AllInputStatus',{
  render () {
    const {pads,width} = this.props;
    const iss = pads.filter(pad =>{
      return !!pad
    }).map(pad =>{
      return c(InputStatus,{pad,width})
    });
    return React.DOM.div({
      className: 'all-input-status',
      style:{width}
    }, ...iss);
  }
})

module.exports = AllInputStatus;
