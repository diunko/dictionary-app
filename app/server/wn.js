
var __assert = require("assert")

var WN = require("../../export/wn.n")


function findRoots(ss){
  var roots = []
  for(var id in ss){
    if(ss[id].hypernyms.length === 0){
      roots.push(id)
    }
  }
  return roots
}


function getSynTreeDepth(rootId){

  var root = ss[rootId]

  if(root.hyponyms.length === 0){
    //console.log(root.hyponyms)
    return 1
  }

  var depth = 1+Math.max.apply(null, root.hyponyms.map(getSynTreeDepth))

  return depth
  
}


function main(){

  var roots = findRoots(ss)

  //console.log(getSynTreeDepth("entity.n.01"))
  //return

  roots.some(function(rId){
    console.log(getSynTreeDepth(rId), rId)
  })

  
}

function getAdjacentSynsets(synId){

  var SS = WN.synsets
  var synset = SS[synId]
  
  __assert(synset, "synset should exist")
  
  var result = {}


  if(synset.hypernyms.length){
    var hyperId = synset.hypernyms[0]
    var hypernym = SS[hyperId]

    // get hypernym's siblings

    if(hypernym.hypernyms.length){
      var grandHyperId = hypernym.hypernyms[0]
      var grandHyper = SS[grandHyperId]

      var hyperSiblings = grandHyper.hyponyms
    }

    // get own siblings

    var siblings = hypernym.hyponyms
    
  }

  // get hyponyms

  var hyponyms = synset.hyponyms


  // add all relevant synsets data to result
  var synsets = {}

  function addSynset(synId){
    synsets[synId] = SS[synId]
  }

  hyperSiblings && hyperSiblings.some(addSynset)
  siblings && siblings.some(addSynset)
  hyponyms && hyponyms.some(addSynset)

  var result = {
    ids: {
      synset: synId,
      hyponyms: hyponyms,
      hyperSiblings: hyperSiblings
    },
    synsets: synsets
  }

  return result
  
}

function search(req, res, next){
  
  var q = req.query.q
  
  if(!q){
    res.sendStatus(403)
    return
  }

  if(!(q in WN.synsets)){
    res.sendStatus(404)
    return
  }

  res.json(WN.synsets[q])

}

function adjacent(req, res, next){
  var synsetId = req.params.synsetId

  if(!synsetId){
    res.sendStatus(400)
    return
  }

  if(!(synsetId in WN.synsets)){
    res.sendStatus(404)
    return
  }

  var result = getAdjacentSynsets(synsetId)

  res.json(result)
  
}


module.exports = {
  routes: [
    ["/search", search],
    ["/synset/:synsetId/adjacent", adjacent]
  ],
  search: search
}

