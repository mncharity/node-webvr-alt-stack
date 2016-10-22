J = require 'joi'
{ vector, float32Array, nullable } = require('joi-schema-vectors')

schema_VRFieldOfView = ->
  J.object().keys
    upDegrees: J.number()
    rightDegrees: J.number()
    downDegrees: J.number()
    leftDegrees: J.number()

schema_VREyeParameters = ->
  J.object().keys
    offset: vector(3)
    fieldOfView: schema_VRFieldOfView()
    renderWidth: J.number().integer().positive()
    renderHeight: J.number().integer().positive()

schema_VRPose = ->
  J.object().keys
    position: nullable vector(3)
    linearVelocity: nullable vector(3)
    linearAcceleration: nullable vector(3)
    orientation: nullable vector(4)
    angularVelocity: nullable vector(3)
    angularAcceleration: nullable vector(3)

check = (data, schema) ->
  J.validate(data,schema,{convert:false}).error

module.exports =
  check_VREyeParameters: (data) -> check(data,schema_VREyeParameters())
  check_VRPose: (data) -> check(data,schema_VRPose())
