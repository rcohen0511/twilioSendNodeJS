var client;
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var port = process.env.PORT || 3000;

var server = http.createServer(function (req, res) {
	console.log(process.env);
	if (req.method.toLowerCase() == 'get') {
		displayForm(res);
	} else if (req.method.toLowerCase() == 'post') {
		formSubmission(req, res);
	}
});

function displayForm(res) {
	fs.readFile('index.html', function (err, data) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
};


function formSubmission(req, res) {
	var fields = [];
	var values = [];
	var form = new formidable.IncomingForm();
	form.on('field', function (field, value) {
		fields[field] = value;
		values.push(value);
	});

	form.on('end', function () {
		res.writeHead(200, {
			'content-type': 'text/plain'
		});
		res.end(util.inspect({
			fields: fields
		}));
		client = require('twilio')(
			"ACa87e8aa01e3aca3e1c104b065a03e951", "530048a4490e8de5edb43db6d8d47d22"
		);		
        client.messages.create({
            from: "+19176151444",
            to: "+1"+values[0],
            body: "Hello from Robert Cohen CS 643 Fall 2017"
        }, function (err, message) {
            if (err) console.error(err.message);
        });
	});
	form.parse(req);
}
server.listen(port);
