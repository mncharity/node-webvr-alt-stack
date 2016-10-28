const {React, c, component, div} = require('./components/react-bare');
const {state,actions} = require('./app');
const AllInputStatus = require('./components/InputStatus');
const RoomView = require('./components/RoomView');
const Table = require('./components/Table');

const App = component('App',{
  render () {
    return div('app',{},[
      c(AllInputStatus,{
        pads: state.pads,
        width: 60,
      }),
      c(RoomView,{
        pads: state.pads,
        canvasSize: {width: 400, height: 250},
      }),
      c(Table,{
        pads: state.pads,
      }),
    ]);
  },
  componentDidMount () {
    actions.set_App(this);
    actions.change_updateInterval(500);
  },
  componentWillUnmount () {
    actions.change_updateInterval(0);
    actions.set_App(null);
  },
})

module.exports = App;
