const {React, c, component, div} = require('./react-bare');
const {sprintf} = require("sprintf-js");

const Information = component('Information',{
  render () {
    const {pad} = this.props;
    return div('gamepad-table--information',{},[
      div('gamepad-table--information--id',{},pad.id)
    ]);
  }
})

//ISSUE WORKAROUND Float32Array values shown with excess precision.
//Workaround: Array.from(float32Array) before .map()ing values.
//electro-webvr/examples/welcome.html hit the same issue with .toFixed,
//so it's not sprintf's fault.  Chromium bug?

const Orientation = component('Orientation',{
  render () {
    const {pad} = this.props;
    var kids = [];
    if (pad.pose && pad.pose.orientation) {
      //ISSUE WORKAROUND Float32Array values shown with excess precision.
      const [x,y,z,w] = Array.from(pad.pose.orientation).map( v =>{
        return sprintf("%+5.2f",v)
      });
      kids = [
        div('gamepad-table--number gamepad-table--axis-x',{},x),
        div('gamepad-table--number gamepad-table--axis-y',{},y),
        div('gamepad-table--number gamepad-table--axis-z',{},z),
        div('gamepad-table--number gamepad-table--w',{},w),
      ];
    }
    return div('gamepad-table--orientation',{},kids);
  }
})

const Position = component('Position',{
  render () {
    const {pad} = this.props;
    var kids = [];
    if (pad.pose && pad.pose.position) {
      //ISSUE WORKAROUND Float32Array values shown with excess precision.
      const [x,y,z] = Array.from(pad.pose.position).map( v =>{
        return sprintf("%+5.2f",v)
      });
      kids = [
        div('gamepad-table--number gamepad-table--axis-x',{},x),
        div('gamepad-table--number gamepad-table--axis-y',{},y),
        div('gamepad-table--number gamepad-table--axis-z',{},z),
      ];
    }
    return div('gamepad-table--position',{},kids);
  }
})

const Row = component('Row',{
  render () {
    const {pad} = this.props;
    return div('gamepad-table-row',{},[
      c(Position,{pad}),
      c(Orientation,{pad}),
      c(Information,{pad}),
    ]);
  }
})


const Table = component('Table',{
  render () {
    const {pads} = this.props;
    const rows = pads.map((pad,i)=>{
      return c(Row,{pad});
    });
    return div('gamepad-table',{
    },rows);
  }
})

module.exports = Table;
