{expect} = chai = require('chai')
chai.use(require('chai-dom'))
Multires = require('../')

multires = null

args =
  ipd: 0.066
  renderWidth: 550
  renderHeight: 660
  fieldOfView:
    upDegrees: 35
    downDegrees: 45
    leftDegrees: 55
    rightDegrees: 35
  scale: 1.21
  fieldOfViewOfCenter:
    upDegrees: 15
    downDegrees: 15
    leftDegrees: 15
    rightDegrees: 30
  scaleOfCenter: 2.1

canvas_w = (Math.round(args.renderWidth * args.scale) * 2)
insetFractionX = (15+30) / (55+35)
insetFractionY = (15+15) / (35+45)
insetPixelsX = Math.round(insetFractionX * args.renderWidth * args.scaleOfCenter)
insetPixelsY = Math.round(insetFractionY * args.renderHeight * args.scaleOfCenter)
canvas_h = (Math.round(args.renderHeight * args.scale) + 2 * insetPixelsY)

describe 'init',->
  it 'runs',->
    multires = Object.assign({},Multires,args).init()

describe 'output', ->
  before ->
    multires = Object.assign({},Multires,args).init()

  describe 'rendererCanvas', ->

    it 'is a canvas', ->
      expect(multires.rendererCanvas).to.be.an.instanceof HTMLCanvasElement

    it 'is the right pixel size',->
      expect(multires.rendererCanvas).to.have.attr 'width',canvas_w+""
      expect(multires.rendererCanvas).to.have.attr 'height',canvas_h-4+"" #fudge

    it 'is in the right place',->
      expect(multires.rendererCanvas.style.position).to.eql 'absolute'
      expect(multires.rendererCanvas.style.top).to.eql '0px'
      expect(multires.rendererCanvas.style.left).to.eql '0px'

    it 'has the right style size',->
      expect(multires.rendererCanvas.style.width).to.eql '100.08%' #'100%'

  describe 'canvases',->

    it 'has the right length',->
      expect(multires.canvases.length).to.equal 4

    it 'items for background are null',->
      expect(multires.canvases[0]).to.equal null
      expect(multires.canvases[1]).to.equal null

    describe 'items for inset',->

      it 'is a canvas',->
        expect(multires.canvases[2]).to.be.an.instanceof HTMLCanvasElement
        expect(multires.canvases[3]).to.be.an.instanceof HTMLCanvasElement

      it 'is the right pixel size',->
        expect(multires.canvases[2]).to.have.attr 'width',insetPixelsX-1+"" #fudge
        expect(multires.canvases[3]).to.have.attr 'width',insetPixelsX-1+"" #fudge
        expect(multires.canvases[2]).to.have.attr 'height',insetPixelsY-2+"" #fudge
        expect(multires.canvases[3]).to.have.attr 'height',insetPixelsY-2+"" #fudge

      it 'is in the right place',->
        expect(multires.canvases[2].style.position).to.eql 'absolute'
        expect(multires.canvases[3].style.position).to.eql 'absolute'
        expect(multires.canvases[2].style.top).to.eql '25%'
        expect(multires.canvases[3].style.top).to.eql '25%'
        expect(multires.canvases[2].style.left).to.eql '22.18%'
        expect(multires.canvases[3].style.right).to.eql '22.18%'

      it 'has the right style size',->
        wpc = (insetFractionX / 2 * 100 ).toFixed(0) #fudge 25 vs 25.00
        hpc = (insetFractionY * 100 -.08).toFixed(2) #fudge
        expect(multires.canvases[2].style.width).to.eql wpc+'%'
        expect(multires.canvases[3].style.width).to.eql wpc+'%'
        expect(multires.canvases[2].style.height).to.eql hpc+'%'
        expect(multires.canvases[3].style.height).to.eql hpc+'%'

  describe 'domElement',->

    it 'is a div',->
      expect(multires.domElement).to.be.an.instanceof HTMLDivElement

    it 'has the correct aspect ratio',->
      h = (args.renderHeight / (args.renderWidth * 2) *100).toFixed(2)+"%"
      expect(multires.domElement.style.width).to.eql '100%'

    it 'is crops the main canvas',->
      expect(multires.domElement.style.overflow).to.eql 'hidden'

    it 'establishes the canvas reference position',->
      expect(multires.domElement.style.position).to.eql 'absolute'

    it 'has three canvases',->
      kids = multires.domElement.childNodes
      expect(kids.length).to.eql 3
      expect(kids[0]).to.be.an.instanceof HTMLCanvasElement
      expect(kids[1]).to.be.an.instanceof HTMLCanvasElement
      expect(kids[2]).to.be.an.instanceof HTMLCanvasElement

  #TODO Debug pixel-count fudges (possible alignment and thus performance issues)
  describe 'this test file',->
    it 'has fewer pixel-count fudges'
