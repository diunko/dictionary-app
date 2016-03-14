
var React = require('react');
var app = require('./app');
var WNApp = app.WNApp

var Ctx = require("./state").Ctx;

var Bootstrap = React.createFactory(Ctx.bootstrap(WNApp));

React.render(
  Bootstrap(),
  document.getElementById('root')
);

window.Immutable = require("immutable")

