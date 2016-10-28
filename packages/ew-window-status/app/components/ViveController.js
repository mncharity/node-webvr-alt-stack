const {React, c, component} = require('./react-bare');
const Battery = require('./Battery');
const Button = require('./Button');
const { polarToCartesian, describeArc } = require('./describeArc');

const DeviceOutline = component('DeviceOutline',{
  render () {
    const {width} = this.props;
    const scale = 'scale('+(width/120)+')';
    const outline = React.DOM.polygon({
      className: 'vive-controller-background',
      points:"-30,-60 30,-60 15,60 -15,60",
      fill:'#000',
      opacity:.2,
    });
    return React.DOM.g(
      {transform: scale},
      outline
    );
  }
})

const GripButtons = component('GripButtons',{
  render () {
    const {cx,cy,button} = this.props;

    const gripR = c(Button,{cx, cy, button});
    const gripL = null; //c(Button,{cx:-cx, cy, button});

    return React.DOM.g({},
      gripL, gripR
    );
  }
})

const Touchpad = component('Touchpad',{
  render () {
    const {cx,cy,r,pad} = this.props;
    const center = 'translate('+cx+' '+cy+')';
    const {pressed, touched, x, y} = pad.buttonTouchpad;

    const cls = 'vive-controller-touchpad ' +
        (pressed ? 'button-pressed ' :
         touched ? 'button-touched ' :
         'button-default ');

    const touchpad = React.DOM.circle({
      className: cls,
      cx:0,
      cy:0,
      r,
      strokeWidth: r *.15,
    });

    const touch = !touched ? null : c(Button,{
      cx: Math.round(x * r),
      cy: Math.round(-y * r),
      button: pad.buttonTouchpad,
    });

    return React.DOM.g(
      {transform: center},
      touchpad,
      touch
    );
  }
})

const Trigger = component('Trigger',{
  render () {
    const {r,button} = this.props;
    const value = button.value;

    const arcLen = 70;
    const arcStart = 260;

    const track = React.DOM.path({
      className: 'vive-controller-trigger button-default',
      d: describeArc(0,0,r, arcStart, arcStart+arcLen),
      style:{fill:'transparent'},
      strokeWidth:3,
      stroke: '#aaa',
    });
    const travel = React.DOM.path({
      className: 'vive-controller-trigger button-pressed',
      d: describeArc(0,0,r, arcStart +arcLen*(1-value), arcStart +arcLen),
      style:{fill:'transparent'},
      strokeWidth:3,
      stroke: '#666',
    });

    const arcButtonOffset = -10; //FIXME fragile in size change
    const a = polarToCartesian(0,0,r,arcStart+arcButtonOffset);
    const bTrigger = c(Button,{cx:a.x, cy:a.y, button})

    return React.DOM.g({}, track, travel, bTrigger);
  }
})

const ViveController = component('ViveController',{
  render () {
    const {width,pad} = this.props;
    const height = Math.round(width * 1.2);
    const center = ('translate('+
                    Math.round(width/2)+' '+
                    Math.round(height*.47)+')');
    const r = width * .3;

    const touchpad = c(Touchpad,{
      cx: 0, cy: 0, r, pad
    });

    const bMenu = c(Button,{
      cx: 0,
      cy: -r *1.3,
      button: pad.buttonMenu,
    });

    const bSystem = c(Button,{
      cx: 0,
      cy: r *1.3,
      button: pad.buttonSystem,
    });

    const bGrip = c(GripButtons,{
      cx: r *0.5,
      cy: r *1.4,
      button: pad.buttonGrip,
    });

    const trigger = c(Trigger,{r:r*1.3, button: pad.buttonTrigger});

    var battery = c(Battery,{
      cx: 0,
      cy: r *1.8,
      width: width *.5,
      height: width *.5*.1,
      chargePercent: pad.DeviceBatteryPercentage,
      isCharging: pad.DeviceIsCharging,
    });
    if (!pad.DeviceProvidesBatteryStatus) {
      battery = null;
    }

    const outline = c(DeviceOutline,{width});

    return React.DOM.svg(
      {width,height},
      React.DOM.g(
        {
          transform: center
        },
        outline,
        touchpad,
        trigger,
        battery,
        bGrip,
        bMenu,
        bSystem
      ));
  }
})

module.exports = ViveController;
