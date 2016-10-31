var React = require('react'),
    ReactDOM = require('react-dom'),
    ReactApp = require('./components/ReactApp'),
    mountNode = document.getElementById('react-main-mount');

ReactDOM.render(<ReactApp />, mountNode);
