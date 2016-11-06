var React = require('react'),
    ReactDOM = require('react-dom'),
    Router = require('react-router').Router,
    Route = require('react-router').Route,
    Link = require('react-router').Link,
    Report = require('./components/Report.jsx'),
    LoadReport = require('./components/LoadReport.jsx'),
    history = require('history'),
    mountNode = document.getElementById('react-main-mount');

ReactDOM.render(
    <Router history={history.createHistory()}>
        <Route path="/" component={Report} />
        <Route path="/load" component={LoadReport} />
    </Router>,
    mountNode
);
