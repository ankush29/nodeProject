var express  = require('express');
var app      = express();
var morgan = require('morgan');            
var bodyParser = require('body-parser');   
var methodOverride = require('method-override');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.use(express.static(__dirname + '/public'));                 
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

app.get('/api/companies', function(req, res) {
	console.log("req.query",req)
	function getSuggestions() {
		var query = {
		  match_phrase_prefix : {
		   name: req.query.term
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
		}).then(function (resp) {
		    var hits = resp.hits.hits;
		    var i = 0, hits_in, hits_out = [];

		    hits_in = resp.hits.hits;

		    for(; i < hits_in.length; i++) {
		      hits_out.push(hits_in[i]._source);
		    }
		    res.json(hits_out);
		}, function (err) {
		    console.trace(err.message);
		    res.send(err)
		});
	}

	getSuggestions();
});

app.get('*', function(req, res) {
	res.sendfile('./public/views/index.html'); 
});
app.listen(8080);
console.log("App listening on port 8080");