var React = require('react'),
    Select = require('./Select.jsx'),
    Griddle = require('griddle-react'),
    Highcharts = require('highcharts'),
    jQuery = require('jquery');

module.exports = React.createClass({

    getDefaultProps: function () {
        return {
            columnMeta: [
                'ProbeName', 
                'BotIP',
                'BotCountry',
                'RequestCommand',
                'RequestPath', 
                'BotUA',
                'BotDNSName'
            ],
            perPageValues: [5, 10, 25, 50, 100],
            perPage: 10
        };
    },

    getInitialState: function () {
        return {
            rows: {},
            perPage: this.props.perPage
        };
    },

    componentDidMount: function () {
        jQuery.ajax('/lasthits', {method: 'get'})
            .done(function (rows) {
                this.setState({rows: rows});
            }.bind(this));
    },

    getColumnMeta: function () {
        return this.props.columnMeta.map(function (row, index) {
            return {
                columnName: row,
                order: index + 1,
                locked: false,
                visible: true
            };
        });
    },

    onPerPageChange: function (e) {
        this.setState({perPage: e.target.value});
    },

    render: function () {
        return (
            <div id="table-area">
                <Select
                    className="table__perpage-select"
                    defaultVal={this.props.perPage}
                    options={this.props.perPageValues}
                    onChange={this.onPerPageChange}
                />
                <Griddle
                    results={this.state.rows}
                    columnMetadata={this.getColumnMeta()}
                    resultsPerPage={this.state.perPage}
                    tableClassName="table"
                />
            </div>
        )
    }

});
