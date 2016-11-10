var React = require('react'),
    Chart = require('./Chart.jsx'),
    jQuery = require('jquery'),
    Period = require('./Period.jsx'),
    _ = require('underscore');

module.exports = LoadReport = React.createClass({

    getDefaultProps() {
        return {
            apiEndpoint: '/loadstats',
            config: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Запросы ботов по дням'
                }
            }
        };
    },

    getInitialState() {
        return {
            chartOptions: {}
        };
    },

    fetch(options) {
        return jQuery.ajax(this.props.apiEndpoint, {
            method: 'get',
            data: options || {}
        });
    },

    buildChartOptions(rows) {
        this.setState({
            chartOptions: _.extend({}, this.props.config, {
                xAxis: {
                    categories: rows.map(row => {
                        return row.date;
                    })
                },
                series: [{
                    name: 'Requests',
                    data: rows.map(row => {
                        return row.count;
                    })
                }]
            })
        });
    },

    onPeriodChange(period) {
        this
            .fetch({
                from: period.startDate.format('Y-M-DD'),
                to: period.endDate.format('Y-M-DD')
            })
            .then(this.buildChartOptions);
    },

    render() {
        return (
            <div>
                <Chart params={this.state.chartOptions} />
                <Period onChange={this.onPeriodChange} />
            </div>
        );
    }
});
