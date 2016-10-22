const { emit_vrdisplaypresentchange } = require('./create');

const viveSize = {w:2160, h:1200};
const visibleArea = 0.876;
const visibleSize = {w: Math.round(viveSize.w * visibleArea),
                     h: Math.round(viveSize.h * visibleArea)};

const c_APIVisibleL = 'vrdisplay--visible-area-left ';
const c_APIVisibleR = 'vrdisplay--visible-area-right ';

const c_Self = 'present-simple ';
const c_Background =  'presentation-background ';
const c_Frame = 'presentation-frame ';
const c_Layers = 'presentation-layers ';

function presentationDivCreate () {
  const zindex = 10000;

  if (document.getElementsByClassName(c_Self+c_Background).length)
    return;

  const div = (cN)=>{
    const d = document.createElement('div');
    d.className = cN; return d; };

  const divBackground = div(c_Self+c_Background);
  const divFrame = div(c_Self+c_Frame);
  const divLayers = div(c_Self+c_Layers);
  const apiVisL = div(c_APIVisibleL);
  const apiVisR = div(c_APIVisibleR);
  
  ((e)=>{
    const top = Math.round((viveSize.h - visibleSize.h)/2);
    const left = Math.round((viveSize.w - visibleSize.w)/2);
    const right = viveSize.w - visibleSize.w - left;
    const bottom = viveSize.h - visibleSize.h - top;
    e.style.top = top+"px";
    e.style.left = left+"px";
    e.style.right = right+"px";
    e.style.bottom = bottom+"px";
  })(divFrame);

  const style = document.createElement('style');
  const css = (`
             `+'.'+c_Self+'.'+c_Background+`{
               position: fixed;
               z-index`+zindex+`;
               left:0; right:0; top:0; bottom:0;
               background-color: black;
             }
             `+'.'+c_Self+'.'+c_Frame+` {
               position: absolute;
               // set by code: top left bottom right
               background-color: gray;
             }
             `+'.'+c_Self+'.'+c_Layers+` {
               position: absolute;
               z-index: 0; //Create stacking context for layers.
               left:0; top:0;
               width: 100%;
               height: 100%;
             }
             `+'.'+c_Self+'.'+c_Layers+` > * {
               position: absolute;
               left: 0;
               top: 0;
               width: 100% !important;
               height: 100% !important;
             }
             `+'.'+c_Self+'.'+c_APIVisibleL+` {
               position: absolute;
               z-index: 1;
               width: 50%;
               height: 100%;
             }
             `+'.'+c_Self+'.'+c_APIVisibleR+` {
               position: absolute;
               z-index: 1;
               right:0; top:0;
               width: 50%;
               height: 100%;
             }
             `);
  style.appendChild(document.createTextNode(css));

  divFrame.appendChild(divLayers);
  divFrame.appendChild(apiVisL);
  divFrame.appendChild(apiVisR);
  divBackground.appendChild(style);
  divBackground.appendChild(divFrame);
  document.body.appendChild(divBackground);
}
function presentationDivAttach (canvas) {
  const e = document.getElementsByClassName(c_Self+c_Layers)[0];
  while (e.firstChild) {e.removeChild(e.firstChild);}
  e.appendChild(canvas);
}
function presentationDivSetVisibility (isVisible) {
  const e = document.getElementsByClassName(c_Self+c_Background)[0];
  e.style.display = isVisible ? "block" : "none";
}

module.exports = {
  make: function (opts) {
    const options = Object.assign({},{
      scale: 1,
    },opts);
    var _layers = [];
    var _canvas = null;
    var _visible = false;
    return {
      isPresenting: false,

      canPresent: true,
      maxLayers: 1,

      upDegrees: 46,
      downDegrees: 47,
      leftDegrees: 50,
      rightDegrees: 43,

      offset_left: new Float32Array([-0.03,0,0]),
      offset_right: new Float32Array([0.03,0,0]),

      renderWidth: Math.round(visibleSize.w / 2 * options.scale),
      renderHeight: Math.round(visibleSize.h * options.scale),

      getLayers: function () {
        return _layers.map((lay)=>{
          var layer = lay;
          if (lay.leftBounds == undefined || lay.rightBounds == undefined) {
            // ISSUE: getLayers spec needs review.
            // per https://w3c.github.io/webvr/#interface-vrlayer 21 September 2016
            //  dictionary VRLayer { sequence<float>? leftBounds
            // but https://www.w3.org/TR/WebIDL/#es-nullable-type 19 April 2012
            //  JS undefined -> IDL null -> JS null
            // So a valid input layer may not be valid output.  Sigh.
            // Was causing error in three.js r81.2 vive demos.
            // The leftBounds MUST default to [0.0, 0.0, 0.5, 1.0].
            // The rightBounds MUST default to [0.5, 0.0, 0.5, 1.0].
            layer = Object.assign({
              leftBounds: [0.0, 0.0, 0.5, 1.0],
              rightBounds: [0.5, 0.0, 0.5, 1.0],
            },layer);
          };
          return layer;
        });
      },
      requestPresent: function (layers) {
        var canvas = layers[0].source;
        if (!canvas) {
          throw "Argument error: requestPresent called with: "+layers;
          //return new Promise(function(cb,err){err()});
        }
        _layers = layers;
        if (!this.isPresenting) {
          this.isPresenting = true;
          emit_vrdisplaypresentchange(this,null);
          presentationDivCreate();
        }
        if (_canvas != canvas) {
          _canvas = canvas;
          presentationDivAttach(canvas);
        }
        if (!_visible) {
          _visible = true;
          presentationDivSetVisibility(true);
        }
        return new Promise(function(cb){cb()});
      },
      exitPresent: function () {
        this.isPresenting = false;
        emit_vrdisplaypresentchange(this,null);
        _layers = [];
        _visible = false;
        presentationDivSetVisibility(false);
        return new Promise(function(cb){cb()});
      },
    };
  }
};
