const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;

const writingsSchema = new Schema({
	MyTitle: { type: String, required: true },
	MyText: String
});

const Writings = mongoose.model('Writings', writingsSchema);

/**
 * Create Express server.
 */
const app = express();

/**
 * Register Express middleware
 *  - bodyParser: allows us to access the request body of route requests
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Configure Mongoose and connect to MongoDB
 */
mongoose.Promise = global.Promise;
try {
	mongoose.connect('mongodb://localhost/blogpost');
	console.log('connected to mongoDB');
} catch (e) {
	console.log('ERROR: could not connect to mongoDB. Is it running? (use `mongod`)');
	process.exit(1);
}

app.use('/assets', express.static(path.resolve('step-3/assets'), { maxAge: '30 days' }));

app.get('/writings', (req, res) => {
	Writings.find((err, writings) => {
		if (err) return res.status(500).send(err);

		res.send(writings);
	});
});

app.post('/writings', (req, res) => {
	const newWritings = new Writings(req.body);

	newWritings.save((err, writings) => {
		if (err) return res.status(500).send(err);

		res.send(writings);
	});
});

/**
 * default route: send html
 */
app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Start server
 */
const server = app.listen('8080', function() {
  console.log('Server up and running at port ' + server.address().port)
});
