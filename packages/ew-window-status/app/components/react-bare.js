const React = require('react');
const ReactDOM = require('react-dom')

module.exports = {
  React,
  ReactDOM,
  c () {
    return React.createElement.apply(React,arguments)
  },
  component (name,o) {
    o.displayName=name;
    return React.createClass.call(React,o);
  },
  div (cls,opts,kids) {
    const options = Object.assign({className:cls},opts);
    const children = kids instanceof Array ? kids : Array.from(arguments).slice(2);
    return React.DOM.div.call(React.DOM,options,...children);
  },
}
