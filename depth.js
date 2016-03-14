
var nn = require("./export/wn.n")


var ss = nn.synsets

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


main()

