
var Router = require("director").Router
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Immutable = require('immutable');

var SynQuery = React.createClass({
  displayName: 'SynQuery',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();

    var synquery_ = binding.sub("query")
    var synquery = synquery_.get()

    return <div>{synquery}</div>

  }
  
});

module.exports = {
  SynQuery: SynQuery
}


