var React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    Report = require('../components/Report.jsx'),
    LoadReport = require('../components/LoadReport.jsx'),
    Router = require('react-router').Router,
    Route = require('react-router').Route,
    history = require('history');

module.exports = function(app) {
    app.get('*', function(req, res){
        res.render('index.ejs', {
            reactOutput: ReactDOMServer.renderToString(
                <Router history={history.createMemoryHistory()}>
                    <Route path="/" component={Report} />
                    <Route path="/load" component={LoadReport} />
                </Router>
            )
        });
    });
};
