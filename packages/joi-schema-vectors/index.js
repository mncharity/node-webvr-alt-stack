const J = require('joi');

function float32Array (len) {
  var keys = {}, i;
  for(i=0;i<len;i++) keys[i] = J.number();
  return J.object().type(Float32Array).length(len).unknown(true).keys(keys);
}

function arrayOfNumber (len) {
  return J.array().length(len).items(J.number());
}

function vector (len) {
  return J.alternatives().try(float32Array(len), arrayOfNumber(len));
}

function nullable (schema) {
  return J.alternatives().try(J.any().only(null),schema);
}

module.exports = {
  nullable,
  vector,
  float32Array
}
