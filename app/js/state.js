
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Router = require('director').Router;
var Immutable = require('immutable');
var request = require('superagent');

window.Req = request

var Ctx = (function(){

  var ctx =  Morearty.createContext({
    initialState: {
      query: "entity",
      searchResult: {
        ids:{
          hyperSiblings: [],
          hyponyms: [],
          synset: null
        },
        synsets: {}
      },
      rootId: "entity.n.01",
    }
  });


  ctx.getBinding().addListener("query", function(changes){

    if(changes.isValueChanged()){
      var q = changes.getCurrentValue()

      request.get("/synset/"+q+"/adjacent")
        .end(function(err, resp){
          console.log("err, response", err, resp)
          
          if(!err){
            var b = ctx.getBinding()
            b.set("searchResult", Immutable.Map(JSON.parse(resp.text)))
            b.set("rootId", q)
          }
          
        })
    }
    
  })

  return ctx;
  
})()

window.$appctx = Ctx

var $state

module.exports = {
  Ctx: Ctx
};





