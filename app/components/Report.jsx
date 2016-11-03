var React = require('react'),
    Select = require('./Select.jsx'),
    Griddle = require('griddle-react'),
    Chart = require('./Chart.jsx'),
    jQuery = require('jquery');


module.exports = React.createClass({

    getDefaultProps() {
        return {
            columnMeta: {
                count: 'Кол-во',
                ip: 'Адрес',
                country: 'Код страны'
            },
            perPageValues: [5, 10, 25, 50, 100],
            perPage: 10
        };
    },

    getInitialState() {
        return {
            rows: [],
            perPage: this.props.perPage
        };
    },

    componentDidMount() {
        jQuery.ajax('/topbots', {method: 'get'})
            .done(function (rows) {
                this.setState({rows: rows});
            }.bind(this));
    },

    getColumnMeta() {
        return Object.keys(this.props.columnMeta).map(function (key, index) {
            return {
                columnName: key,
                displayName: this.props.columnMeta[key],
                order: index + 1,
                locked: false,
                visible: true
            };
        }, this);
    },

    getRandomColor() {
        var letters = '0123456789ABCDEF',
            color = '#';

        for (var i=0; i<6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    },

    buildChartOptions() {
        return {
            xAxis: {
                categories: this.state.rows.map(function (row) {
                    return row.ip;
                })
            },
            series: [{
                segmentColor: this.getRandomColor(),
                data: this.state.rows.map(function (row) {
                    return [row.ip, row.count];
                }).slice(0, 10)
            }]
        };
    },

    onPerPageChange(e) {
        this.setState({perPage: e.target.value});
    },

    render() {
        return (
            <div>
                <Chart params={this.buildChartOptions()} />
                Записей на страницу: <Select
                    className="table__perpage-select"
                    defaultVal={this.props.perPage}
                    options={this.props.perPageValues}
                    onChange={this.onPerPageChange}
                />
                <Griddle
                    useGriddleStyles={false}
                    results={this.state.rows}
                    columnMetadata={this.getColumnMeta()}
                    resultsPerPage={this.state.perPage}
                />
            </div>
        )
    }

});
