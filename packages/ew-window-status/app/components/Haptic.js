const {React, c, component, div} = require('./react-bare');

const Haptic = component('Haptic',{
  render () {
    const {pad} = this.props;
    if (!pad.hapticActuators) return null;
    if (pad.hapticActuators.length < 1) return null;
    return c('button',{
      className: 'gamepad-haptic--button',
      type: 'button',
      onClick: this.triggerHapticPulse,
      dangerouslySetInnerHTML:{__html:"&#x1f44b;"},
    });
  },
  triggerHapticPulse () {
    const {pad} = this.props;
    pad.hapticActuators[0].pulse(undefined,2.0);
  },
})

module.exports = Haptic;
