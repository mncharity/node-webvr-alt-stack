const THREE = require('three');
const {React, c, component, ReactDOM} = require('./react-bare');

function v3 (x,y,z){return new THREE.Vector3(x,y,z)}
function col (r,g,b){return new THREE.Color(r,g,b)}
function createAxes (size,linewidth) {
  const sz = size, lw = linewidth;
  const geometry = new THREE.Geometry();
  geometry.vertices = [
    v3(0, 0, 0),  v3(sz, 0, 0),
    v3(0, 0, 0),  v3(0, sz, 0),
    v3(0, 0, 0),  v3(0, 0, sz)
  ];
  geometry.colors = [
    col(1, 0, 0),  col(1, 0.6, 0),
    col(0, 1, 0),  col(0.6, 1, 0),
    col(0, 0, 1),  col(0, 0.6, 1)
  ];
  const material = new THREE.LineBasicMaterial( {
    vertexColors: THREE.VertexColors,
    linewidth: lw
  });
  return {
    geometry,
    material,
    object: new THREE.LineSegments( geometry, material ),
  }
}
function createPole (size,linewidth) {
  const geometry = new THREE.Geometry();
  geometry.vertices = [v3(0, 0, 0),  v3(0, size, 0)];
  geometry.colors = [col(.7, .7, .7),  col(.8, 1, .8)];
  const material = new THREE.LineBasicMaterial( {
    vertexColors: THREE.VertexColors,
    linewidth: linewidth,
  });
  const object = new THREE.LineSegments( geometry, material );
  return {
    geometry,
    object,
    setY (y) {
      geometry.vertices[1].y = y;
      geometry.verticesNeedUpdate = true;
    }
  };
}
function createAxesOnPole (poleArg,axesArg) {
  const pole = createPole(poleArg.size,poleArg.linewidth);
  const axes = createAxes(axesArg.size,axesArg.linewidth);
  const object = new THREE.Object3D();
  object.add(pole.object);
  object.add(axes.object);
  return {
    object,
    setFromPose (pose) {
      object.position.x = pose.position[0];
      object.position.z = pose.position[2];
      pole.setY(pose.position[1]);
      axes.object.position.y = pose.position[1];
      const po = pose.orientation;
      const q = new THREE.Quaternion(...po);
      axes.object.quaternion.copy(q);
      axes.object.updateMatrix();
      axes.object.matrixAutoUpdate = false;
    }
  };
}


class RoomView {
  constructor ({size}) {
    this.size = size;
    this.widthM = 12;
    this.init();
  }
  init () {
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( this.size.width, this.size.height );
    renderer.setClearColor( 0x808080, 1 );
    const scene = this.scene = new THREE.Scene();
    const aspect = this.size.width / this.size.height;
    const camera = this.camera = new THREE.PerspectiveCamera(10, aspect, 1, 10000);
    camera.position.x = 10;
    camera.position.y = 20;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(0,1,0));
    scene.add(camera);
    const grid = new THREE.GridHelper( this.widthM/2, this.widthM, 0x444444, 0x303030 );
    scene.add(grid);
    const origin = createAxes(1,2);
    // Improve visiblity wrt grid.
    origin.object.position.x = .01;
    origin.object.position.y = .01;
    origin.object.position.z = .01;
    scene.add(origin.object);

    this.devices = [];

    return this;
  }
  _needHowManyDevices (n) {
    for(var i=this.devices.length; i < n; i++) {
      const device = this.devices[i] = createAxesOnPole({size:3,linewidth:2},
                                                        {size:.5,linewidth:2});
      this.scene.add(device.object);
    }
  }
  updatePads (pads) {
    this._needHowManyDevices(pads.length);
    //FIXME assumes monotonic pad count - walk @devices instead
    pads.forEach((pad,i)=>{
      const pose = ((pad.pose && pad.pose.position)
                    ? pad.pose
                    : {position: [100,0,0], orientation: [1,0,0,0]});
      this.devices[i].setFromPose(pose);
    });
    return this;
  }
  render () {
    this.renderer.render(this.scene, this.camera);
    return this;
  }
}

const RoomComponent = component('RoomComponent',{
  render () {
    const {pads, canvasSize} = this.props;
    if (this.graphics) this.graphics.updatePads(pads).render();
    return React.DOM.div({
      className: 'room-view',
    });
  },
  componentDidMount () {
    const {canvasSize} = this.props;
    this.graphics = new RoomView({size:canvasSize});
    ReactDOM.findDOMNode(this).appendChild(this.graphics.renderer.domElement);
    this.graphics.render();
  },
})

module.exports = RoomComponent;
