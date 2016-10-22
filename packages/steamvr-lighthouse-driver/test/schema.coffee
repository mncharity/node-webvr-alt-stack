J = require 'joi'
{ vector, float32Array, nullable } = require('joi-schema-vectors')


vec3 = ->
  J.alternatives().try(
    J.array().length(3).items J.number(),
    J.object().type(Float32Array).unknown(true).keys
      length: J.number().equal(3)
      0: J.number()
      1: J.number()
      2: J.number())
quaternion = ->
  J.alternatives().try(
    J.array().length(4).items J.number(),
    J.object().type(Float32Array).unknown(true).keys
      length: J.number().equal(3)
      0: J.number()
      1: J.number()
      2: J.number()
      3: J.number())

schema_device = 
  J.object().keys
    trackedDeviceIndex: J.number().integer().min(0)
    triggerHapticPulse: J.func().arity(2).optional()
    powerOff: J.func().arity(0).optional()
    properties: J.object().optional().unknown().keys
      value: [J.boolean(),J.number(),J.string(),J.array().items J.number()]
    controllerState: J.object().optional().keys
      unPacketNum: J.number().integer().min(0)
      rAxis: J.array().items J.object().keys
        x: J.number()
        y: J.number()
      ulButtonPressedHI: J.number()
      ulButtonPressedLO: J.number()
      ulButtonTouchedHI: J.number()
      ulButtonTouchedLO: J.number()
    pose: J.object().keys
      deviceIsConnected: J.boolean()
      poseIsValid: J.boolean()
      qDriverFromHeadRotation: quaternion()
      qRotation: quaternion()
      qWorldFromDriverRotation: quaternion()
      result: [J.number().integer().min(0), J.string()]
      shouldApplyHeadModel: J.boolean()
      timeOffset: J.number().max(0)
      vecAcceleration: vec3()
      vecAngularAcceleration: vec3()
      vecAngularVelocity: vec3()
      vecDriverFromHeadTranslation: vec3()
      vecPosition: vec3()
      vecVelocity: vec3()
      vecWorldFromDriverTranslation: vec3()
      willDriftInYaw: J.boolean()
    extras: J.object().optional().keys
      changeCounter: J.number().integer().min(0)
      bProximitySensorTriggered: J.boolean().optional()
      fPhysicalIpdMeters: J.number().min(0).optional()
      ulButtonPressedLO: J.number().optional()

schema_driver = J.object().keys
  update: J.func().maxArity(0)
  shutdown: J.func().maxArity(0)
  userDriverConfigDir: J.string()
  driverInstallDir: J.string()
  devices: J.array().items schema_device
  openvr: J.object()

validate = (data,schema) ->
  result = J.validate(data,schema,{convert:false})
  result.error # null or error msg

module.exports =
  validate_driver: (data) -> validate(data,schema_driver)
  validate_device: (data) -> validate(data,schema_device)
