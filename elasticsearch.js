var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({  
    host: 'localhost:9200',
    log: 'info'
});


/**
* Delete an existing index
*/

function getSuggestions(input) {
  return elasticClient.search({
    index: 'companies',
      type: 'company',
      body: {
        query: {
          match: {
            name: input
          }
        }
      }
    }).then(function (resp) {
        var hits = resp.hits.hits;
    }, function (err) {
        console.trace(err.message);
    })
};
exports.getSuggestions = getSuggestions;