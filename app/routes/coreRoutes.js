var React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    ReactApp = require('../components/ReactApp');

module.exports = function(app) {
    app.get('/', function(req, res){
        res.render('index.ejs', {
            reactOutput: ReactDOMServer.renderToString(<ReactApp />)
        });
    });
};
