var fs = require('fs');
var es = require('elasticsearch');
var client = new es.Client({
  host: 'localhost:9200'
});

fs.readFile('fullfinal.json', {encoding: 'utf-8'}, function(err, data) {
  if (err) { throw err; }

  // Build up a giant bulk request for elasticsearch.
  bulk_request = data.split('\n').reduce(function(bulk_request, line) {
    var obj, company;

    try {
      obj = JSON.parse(line);
    } catch(e) {
      console.log('Done reading');
      return bulk_request;
    }

    // Rework the data slightly
    company = {
      company_id: obj.company_id, // Was originally a mongodb entry
      domain: obj.domain,
      city: obj.city,
      markets: obj.markets,
      clogo: obj.clogo,
      logo: obj.logo,
      name: obj.name,
      country: obj.country,
      website: obj.website,
      description: obj.description
    };

    bulk_request.push({index: {_index: 'companydatabase', _type: 'startup', _id: company.id}});
    bulk_request.push(company);
    return bulk_request;
  }, []);

  // A little voodoo to simulate synchronous insert
  var busy = false;
  var callback = function(err, resp) {
    if (err) { console.log(err); }

    busy = false;
  };

  // Recursively whittle away at bulk_request, 1000 at a time.
  var perhaps_insert = function(){
    if (!busy) {
      busy = true;
      client.bulk({
        body: bulk_request.slice(0, 10)
      }, callback);
      bulk_request = bulk_request.slice(10);
      console.log(bulk_request.length);
    }

    if (bulk_request.length > 0) {
      setTimeout(perhaps_insert, 10);
    } else {
      console.log('Inserted all records.');
    }
  };

  perhaps_insert();
});