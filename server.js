var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var dict = require('./routes/dict');

var port = 3000;

var app = express();



app.set('views', path.join(__dirname, 'views'));
app.set('view enjine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/', index);
app.use('/api', dict);

app.listen(port, function () {
	console.log('Server started on port ' + port);
});