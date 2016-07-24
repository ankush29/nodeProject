companies.factory('companyService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
  var client = elasticsearch({
    host: $location.host() + ':9200'
  });


  var search = function(term) {
    var deferred = $q.defer();
    var query = {
      match_phrase_prefix : {
       name: term
      }
    
    };

    client.search({
      index: 'companydatabase',
      type: 'startup',
      body: {
        size: 10,
        from: 0,
        query: query
      }
    }).then(function(result) {
      var ii = 0, hits_in, hits_out = [];

      hits_in = (result.hits || {}).hits || [];

      for(; ii < hits_in.length; ii++) {
        hits_out.push(hits_in[ii]._source);
      }

      deferred.resolve(hits_out);
    }, deferred.reject);

    return deferred.promise;
  };

  // Since this is a factory method, we return an object representing the actual service.
  return {
    search: search
  };
}]);