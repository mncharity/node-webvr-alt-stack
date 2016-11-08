THREE = if window?.THREE? then window.THREE else require('three')
{round} = Math

class FoV
  constructor: (src) ->
    if src.upDegrees?
      @l = src.leftDegrees
      @r = src.rightDegrees
      @u = src.upDegrees
      @d = src.downDegrees
    else if src instanceof Array
      [@l,@r,@u,@d] = src
    @w = @l + @r
    @h = @u + @d
  flip: ->
    new FoV([@r,@l,@u,@d])
  toCamera: (near,far) ->
    rad = (deg) -> deg/180*Math.PI
    camera = new THREE.PerspectiveCamera( @h, @w/@h, near, far)
    rX = (@u - @d)/2
    rY = (@l - @r)/2
    camera.rotateX(rad(rX))
    camera.rotateY(rad(rY))
    camera

proto =

  # Required:

  renderWidth: undefined
  renderHeight: undefined
  fieldOfView: undefined

  # Optional:

  scale: 1

  ipd: 0.064
  depthNear: 0.01
  depthFar: 10000

  fieldOfViewOfCenter:
    upDegrees: 10
    downDegrees: 20
    leftDegrees: 17
    rightDegrees: 18
  scaleOfCenter: 1

  # Output:

  rendererCanvas: undefined
  domElement: undefined
  cameras: undefined
  eyes: undefined

  # Init

  init: ->

    @init_eyes()

    # create cameras

    fov0 = new FoV(@fieldOfView)
    fov1 = new FoV(@fieldOfViewOfCenter)
    {style,overlayCanvas:cc,viewOffset:vo} = @alignOverlayToPixels(fov0,fov1)

    [Lo,Ro] = @createCameraPair fov0
    [Li,Ri] = @createCameraPair fov0
    Lo.setViewOffset( vo.fullWidth,vo.fullHeight, 0,0, vo.fullWidth,vo.fullHeight)
    Ro.setViewOffset( vo.fullWidth,vo.fullHeight, 0,0, vo.fullWidth,vo.fullHeight)
    Li.setViewOffset( vo.fullWidth,vo.fullHeight, vo.xL, vo.y, vo.width,vo.height)
    Ri.setViewOffset( vo.fullWidth,vo.fullHeight, vo.xR, vo.y, vo.width,vo.height)
    @cameras = [Lo,Ro,Li,Ri]

    # layout rendererCanvas

    w = round (@renderWidth*@scale)
    h = round (@renderHeight*@scale)
    @packing =
      blocks: [
        {x:0, y:0, width:w, height:h}
        {x:w, y:0, width:w, height:h}
        {x:0, y:h, width:cc.width, height:cc.height}
        {x:0, y:h+cc.height, width:cc.width, height:cc.height}
      ]
      width: Math.max(round(@renderWidth*@scale)*2, cc.width)
      height: round(@renderHeight*@scale) + 2 * cc.height

    @blocks = @packing.blocks

    # build things

    @init_rendererCanvas()
    @init_canvases(style)
    @init_domElement()

    this

  init_eyes: ->
    @eyes = new THREE.Object3D()
    @eyeL = new THREE.Object3D()
    @eyeR = new THREE.Object3D()
    @eyes.add @eyeL
    @eyes.add @eyeR
    @eyeL.translateX(-@ipd/2)
    @eyeR.translateX(+@ipd/2)

  alignOverlayToPixels: (fov0,fov1) ->
    # Tweak the overlay fov so its edges are aligned with screen pixels
    # So if you don't mind color artifacts on 1px lines, can use scale:1.
    ppd =
      x: @renderWidth / fov0.w
      y: @renderHeight / fov0.h

    borderDegRaw =
      l: fov0.l - fov1.l
      r: fov0.r - fov1.r
      u: fov0.u - fov1.u
      d: fov0.d - fov1.d

    borderPx =
      l: round (ppd.x * borderDegRaw.l)
      r: round (ppd.x * borderDegRaw.r)
      u: round (ppd.y * borderDegRaw.u)
      d: round (ppd.y * borderDegRaw.d)

    overlayScreenPx =
      w: @renderWidth - borderPx.l - borderPx.r
      h: @renderHeight - borderPx.u - borderPx.d

    overlayCanvasPx =
      w: Math.floor(overlayScreenPx.w * @scaleOfCenter)
      h: Math.floor(overlayScreenPx.h * @scaleOfCenter)

    # for setViewOffset
    viewOffset =
      fullWidth: @renderWidth * @scaleOfCenter
      fullHeight: @renderHeight * @scaleOfCenter
      xL: borderPx.l * @scaleOfCenter
      xR: borderPx.r * @scaleOfCenter
      y: borderPx.u * @scaleOfCenter
      width: overlayCanvasPx.w
      height: overlayCanvasPx.h

    # overlay style as percents - so everything looks right
    # even when the window is small for debugging and preview.
    pc = (n) -> (n * 100).toFixed(2)+"%"
    parentPx =
      w: @renderWidth * 2
      h: @renderHeight
    style =
      left: pc (borderPx.l / parentPx.w)
      top: pc (borderPx.u / parentPx.h)
      width: pc (overlayScreenPx.w / parentPx.w)
      height: pc (overlayScreenPx.h / parentPx.h)

    return {
      overlayCanvas:
        width: overlayCanvasPx.w
        height: overlayCanvasPx.h
      viewOffset: viewOffset
      style: style
    }

  createCameraPair: (fovL) ->
    fovR = fovL.flip()
    cameraL = fovL.toCamera(@depthNear, @depthFar)
    cameraR = fovR.toCamera(@depthNear, @depthFar)
    @eyeL.add cameraL
    @eyeR.add cameraR
    [cameraL, cameraR]

  init_rendererCanvas: ->
    return if !document?
    @rendererCanvas = c = document.createElement('canvas')
    c.setAttribute('width',@packing.width)
    c.setAttribute('height',@packing.height)
    c.style.position = "absolute"
    c.style.left = "0"
    c.style.top = "0"
    c.style.width = (@packing.width / (@renderWidth*2*@scale) *100).toFixed(2)+"%"

  init_canvases: (style) ->
    return if !document?
    @canvases = [null,null] # we use rendererCanvas directly for cameras 0 and 1.
    createOverlay = (block,isLeft) =>
      canvas = document.createElement('canvas')
      canvas.setAttribute('width',block.width)
      canvas.setAttribute('height',block.height)
      canvas.style.position = "absolute"
      if isLeft
        canvas.style.left = style.left
      else
        canvas.style.right = style.left
      canvas.style.top = style.top
      canvas.style.width = style.width
      canvas.style.height = style.height
      @canvases.push canvas

    createOverlay(@blocks[2],true)
    createOverlay(@blocks[3],false)

  init_domElement: ->
    return if !document?
    @domElement = document.createElement('div')
    s = @domElement.style
    s.position = "absolute"
    s.left = "0"
    s.top = "0"
    s.width = "100%"
    s.height = "100%"
    s.overflow = "hidden"

    @domElement.appendChild(@rendererCanvas)
    for canvas in @canvases when canvas
      @domElement.appendChild(canvas)

  # Render

  render: (renderer,scene) ->
    @renderToCanvas(renderer,scene)
    @copyOverlays()

  renderToCanvas: (renderer,scene) ->
    for camera,i in @cameras
      @narrowRendererToBlock(renderer, @blocks[i])
      renderer.render(scene, @cameras[i])

  narrowRendererToBlock: (renderer,block) ->
    y = @packing.height - (block.y + block.height)
    renderer.setViewport( block.x, y, block.width, block.height )
    renderer.setScissor(  block.x, y, block.width, block.height )
    renderer.setScissorTest(true)

  copyOverlays: ->
    src = @rendererCanvas
    for canvas,i in @canvases when canvas
      block = @blocks[i]
      sx = block.x
      sy = block.y
      sw = dw = block.width
      sh = dh = block.height
      dx = dy = 0
      dst = canvas.getContext('2d')
      dst.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh)


module.exports = proto
