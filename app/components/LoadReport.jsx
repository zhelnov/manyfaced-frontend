var React = require('react'),
    Chart = require('./Chart.jsx');

module.exports = LoadReport = React.createClass({

    getDefaultProps() {
        return {
            apiEndpoint: '/loadstats',
            config: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Отчет по количеству запросов у ботов например'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                }
            },
            params: {}
        };
    },

    fetch(options) {
        jQuery
            .ajax(this.props.apiEndpoint, {
                method: 'get',
                data: options || {}
            })
            .done(function (rows) {
                debugger;
            }.bind(this));
    },

    buildChartOptions() {
        return {};
        return {
            xAxis: {
                categories: this.state.rows.map(row => {
                    return row.ip;
                })
            },
            series: [{
                segmentColor: this.getRandomColor(),
                data: this.state.rows.map(row => {
                    return [row.ip, row.count];
                }).slice(0, 10)
            }]
        };
    },

    onPeriodChange(period) {
        this.fetch({
            from: period.startDate.toJSON(),
            to: period.endDate.toJSON()
        });
    },

    render() {
        return (
            <div>тест
                <Chart params={this.buildChartOptions()} />
                <Period onChange={this.onPeriodChange} />
            </div>
        );
    }
});
