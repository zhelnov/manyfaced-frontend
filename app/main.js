var React = require('react'),
    ReactDOM = require('react-dom'),
    ReactApp = require('./components/Report.jsx'),
    mountNode = document.getElementById('react-main-mount');

ReactDOM.render(<ReactApp />, mountNode);
