var React = require('react')
    Griddle = require('griddle-react'),
    resultsPerPage = 15,
    jQuery = require('jquery'),
    columnMeta = ['ProbeName', 
    'BotIP', 'BotCountry', 'RequestCommand', 'RequestPath', 'BotUA', 'BotDNSName'
    ].map(function (row, index) {
        return {
            columnName: row,
            order: index + 1,
            locked: false,
            visible: true
        };
    });

ReactApp = React.createClass({

    getInitialState: function () {
        return {
            rows: {}
        };
    },

    componentDidMount: function () {
        jQuery.ajax('/lasthits', {method: 'get'})
            .done(function (rows) {
                this.setState({rows: rows});
            }.bind(this));
    },

    render: function () {
        return (
            <div id="table-area">
                <Griddle
                    results={this.state.rows}
                    columnMetadata={columnMeta}
                    resultsPerPage={resultsPerPage}
                    tableClassName="table"
                />
            </div>
        )
    }

});

module.exports = ReactApp;
