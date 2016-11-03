var React = require('react'),
    Highcharts = require('react-highcharts'),
    _ = require('underscore');

module.exports = React.createClass({

    getDefaultProps() {
        return {
            config: {
                chart: {
                    type: 'bar'
                },
                legend: {
                    enabled: false
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

    mergeConfig() {
        return _.extend({}, this.props.config, this.props.params);
    },

    render() {
        return React.createElement(Highcharts, {
            config: this.mergeConfig()
        });
    }
});
