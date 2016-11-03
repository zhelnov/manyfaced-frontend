var express = require('express'),
    path = require('path'),
    app = express(),
    config = require('./configs/connection.json'),
    bodyParser = require('body-parser'),
    env = require('./configs/env.json'),
    port = config[env + '-port'] || config['development-port'];

require('node-jsx').install();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./app/routes/coreRoutes.js')(app);
require('./private/ajaxRoutes.js')(app);

app.get('*', function(req, res) {
    res.json({route: '404 not found'});
});

app.listen(port);
console.log((env ? env + '-mode | ' : '') + 'Listen on port: ' + port);
