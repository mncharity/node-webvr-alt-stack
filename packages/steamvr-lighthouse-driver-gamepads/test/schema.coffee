J = require 'joi'

nvec = (len) ->
  keys =
    length: J.number().equal(len)
  for i in [0...len]
    keys[i] = J.number()
  J.alternatives().try(
    J.any().only(null),
    J.array().length(len).items J.number(),
    J.object().type(Float32Array).unknown(true).keys keys
  )

schema_pose = ->
  J.object().keys
    position: nvec(3)
    linearVelocity: nvec(3)
    linearAcceleration: nvec(3)
    orientation: nvec(4)
    angularVelocity: nvec(3)
    angularAcceleration: nvec(3)

#TODO doesn't check: pressed =>  touched and value=1
schema_button = ->
  J.object().keys
    pressed: J.boolean()
    touched: J.boolean()
    value: J.number()

schema_gamepad = ->
  J.object().keys
    index: J.number().integer().positive()
    id: J.string().allow('')
    mapping: J.string().allow('')
    connected: J.boolean()
    buttons: J.array().items schema_button()
    axes: J.array().items J.number()
    pose: schema_pose().allow(null)
    timestamp: J.number().positive()

schema_gamepads1 = ->
  J.array().items schema_gamepad()

check_gamepads = (data) ->
  error = J.validate(data,J.array().min(1)).error
  return {error} if error  
  `if (data[0] != null) {
    return {error:"Expected "+data[0]+" to be null"}}`
  J.validate(data.slice(1),schema_gamepads1()).error

check_properties = (data) ->
  #FIXME UGLY
  error = J.validate(data,J.array().sparse(true).min(1)).error
  return {error} if error
  `if (typeof data[0] != 'undefined') {
    return {error:"Expected "+data[0]+" to be undefined"}}`
  for device in data.slice(1)
    error = 
      J.validate(device,J.object()).error or
      J.validate(Object.keys(device),J.array().items(J.string())).error
    return {error} if error
    # J.validate(Object.values(device),J.array().items # No Object.values yet.
    for k,v of device
      error =
        J.validate(v,J.alternatives().try(
          J.boolean(),
          J.number(),
          J.string().allow(''),
          J.array().items(J.number()),
          J.object().type(Float32Array)
        )).error
      return {error} if error
  null

check = (data,schema) ->
  result = J.validate(data,schema,{convert:false})
  result.error # null or error msg

module.exports =
  validate_pose: (data) -> check(data,schema_pose())
  validate_gamepad: (data) -> check(data,schema_gamepad())
  validate_gamepads: check_gamepads
  validate_properties: check_properties
