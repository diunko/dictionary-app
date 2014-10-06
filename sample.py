
from nltk.corpus import wordnet as wn
from nltk.corpus import semcor
from nltk.probability import *

import json

freq = FreqDist()
for word in semcor.words():
    freq[word.lower()] += 1

wn_synsets = {}
wn_lemmas = {}


def lemma_id(l):
    "Lemma('good.n.01.good')"
    return l.__repr__()[7:-2]

for s in list(wn.all_synsets("v"))[3000:3020]:
    ll = []
    ss_freq = 0
    for l in s.lemmas():
        id = lemma_id(l)
        ll.append(id)
        l_freq = freq[l.name()]
        ss_freq += l_freq
        if not (id in wn_lemmas):
            wn_lemmas[id] = {
                "_id": id,
                "name": l.name(),
                "antonyms": [lemma_id(la) for la in l.antonyms()],
                "synset_id": [s.name()],
                "freq": l_freq }
        else:
            wn_lemmas[id]["synset_id"].append(s.name())

    s1 = { "_id": s.name(),
           "hypernyms": [H.name() for H in s.hypernyms()],
           "hyponyms": [h.name() for h in s.hyponyms()],
           "lemmas": ll,
           "pos": s.pos(),
           "freq": ss_freq,
           "definition": s.definition() }
    
    wn_synsets[s1["_id"]] = s1


print json.dumps({"lemmas": wn_lemmas, "synsets": wn_synsets} , indent=2, sort_keys=True)
    
    
