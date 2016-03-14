
var Router = require("director").Router
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Immutable = require('immutable');

var clientid = window.$clientid = (window.$clientid || __uid())

function __uid(){
  return Math.floor((Math.random()*0x100000000)).toString(36)  
}

var WNTree = React.createClass({
  displayName: 'WNTree',

  mixins: [Morearty.Mixin],

  componentDidMount: function () {
    var binding = this.getDefaultBinding();

    Router({
      '/:synset': function(synset){
        window.$synset = synset
        binding.set("query", synset)
        console.log("/#/:synset", synset)
      }
    }).init();

  },

  render: function () {
    var binding = this.getDefaultBinding();

    var rootId_ = binding.sub("rootId")
    var rootId = rootId_.get()

    var result = binding.get("searchResult").toJS()

    function renderHypernyms(){
      var ids = result.ids.hyperSiblings
      var data = result.synsets

      
      if(ids){
        var children = ids.map(function(id){
          return <Synset rootId={result.ids.synset} synId={id} synData={data[id]} mode="hypernym" />
        })

        var hypernymsAcc = {}
        ids.some(function(id){
          if(data[id] && data[id].hypernyms){
            data[id].hypernyms.some(function(hId){
              hypernymsAcc[hId] = true
            })
          }
        })

        var hIds = Object.keys(hypernymsAcc)
        
        if(hIds.length){
          return <div>
            {hIds.map(function(hId){
              return <div><a href={"/#/" + hId}>{hId}</a></div>
            })}
            <div>{children}</div>
            </div>
        } else {
          return <div>{children}</div>
        }
      }

    }

    function renderSiblings(){

      var data = result.synsets

      var rootId = result.ids.synset
      var synset = data[rootId]

      if(synset){

        var hyperId = synset.hypernyms[0]
        var hyper = data[hyperId]

        if(hyper){
          var ids = hyper.hyponyms
        } else {
          var ids = []
        }

        return ids.map(function(id){
          return <Synset key={id} rootId={rootId} synId={id} synData={data[id]} mode="sibling" />
        })
      }
      
    }

    function renderHyponyms(){

      var data = result.synsets

      var rootId = result.ids.synset
      var synset = data[rootId]

      if(synset){

        var ids = synset.hyponyms

        return ids.map(function(id){
          return <Synset key={id} rootId={rootId} synId={id} synData={data[id]} mode="hyponym" />
        })
        
      }
      
    }


    var containerStyle = {
      display: "flex",
      "flex-direction": "row"
      
    }

    var hyperStyle = {
      //width: "40em"
      "flex-basis": "33%",
      "flex-grow": "1",
      "flex-shrink": "1"
    }

    var synsetStyle = {
      "flex-basis": "33%",
      "flex-grow": "1",
      "flex-shrink": "1"
      //"background-color": "#abc",
      //"width": "40em"
    }

    return <div style={ containerStyle }>
      <div className="cols2" style={ hyperStyle }>{ renderHypernyms() }</div>
      <div className="cols2" style={ synsetStyle }>{ renderSiblings() }</div>
      <div className="cols2" style={ synsetStyle }>{ renderHyponyms() }</div>
    </div>

  }
  
});


var Synset = React.createClass({
  displayName: 'Synset',

  mixins: [Morearty.Mixin],

  render: function () {

    var id = this.props.synId
    var synset = this.props.synData
    var mode = this.props.mode
    var rootId = this.props.rootId

    var divStyle = {
      display: "inline-block",
      "background-color": "#ccc",
      //"margin-right": "1em",
      "margin-bottom": "15px",
      position: "relative"
    }

    var headStyle = {
      "padding": "5px",
      "background-color": "#424242",
      "color": "#e9e9e9"
    }

    var freqStyle = {
      position: "absolute",
      "right": "5px",
      "top": "5px",
      "color": "#e9e9e9"
    }

    var defStyle = {
      "margin": "3px",
      "background-color": "#eee",
      "padding": "5px"
    }

    var hyponymsStyle = {
      "display": "block",
      "color": "#555",
      "padding": "2px",
      "margin":"3px",
      "background-color": "#ddd"
    }

    var hyponymsRootStyle = {
      "display": "block",
      "color": "#555",
      "padding": "2px",
      "margin":"3px",
      "background-color": "#F38630"
    }

    var contentStyle = {
      //display: "none"
    }

    var lemmasStyle = {
      margin: "3px",
      "margin-left": "15px",
    }

    var lemmaStyle = {
      "background-color": "rgb(250, 207, 123)",
      "color": "#888",
      "display": "inline-block",
      "margin-left": "0.2em",
      "margin-bottom": "0.2em",
      padding: "2px"
    }

    if(mode === "sibling" && id === rootId){
      headStyle["background-color"] = "#F38630"
      divStyle["border"] = "3px solid #FA6900"
    }

    if(synset && synset.hyponyms && synset.hyponyms.indexOf(rootId) !== -1){
      divStyle["border"] = "3px solid #FA6900"
    }

    var self = this

    return <div style={divStyle} key={id}>
      <div style={headStyle}>{ synset._id }</div>
      <div style={freqStyle}>{ synset.freq }</div>
      <div style={ contentStyle }>
        <div style={defStyle}>{ synset.definition}</div>
        { (function(){
          if (mode === "sibling" || mode === "hyponym") {
            return <div style={lemmasStyle}>
              {
                synset.lemmas.map(function(lId){
                  var _ = lId.split(".")
                  var synset=_[0], pos=_[1], sense=_[2], lemma=_[3]
                  return <div style={lemmaStyle}>{ lemma } </div>
                }, this)
              }
            </div>
          }}).call(this)
        }
        <div>{ synset.hyponyms.map(function(hId){
          if(hId === rootId){
            return <a href={"/#/"+hId} style={ hyponymsRootStyle }>{hId.replace(/[_.]/g," ")}</a>
          } else {
            return <a href={"/#/"+hId} style={ hyponymsStyle }>{hId.replace(/[_.]/g," ")}</a>
          }
        }, this) }</div>
      </div>
    </div>

  }
  
});

module.exports = {
  WNTree: WNTree
}


