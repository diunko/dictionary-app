
var Morearty = require('morearty');
var React = window.React = require('react/addons');

var SynQuery = require("./synquery").SynQuery
var WNTree = require("./wntree").WNTree

var WNApp = React.createClass({
  displayName: 'WNApp',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();

    return (
      <section id='wordnet'>
        <SynQuery binding={ binding } />
        <WNTree binding={ binding } />
      </section>
    );
  }
})

module.exports = {
  WNApp: WNApp
};

