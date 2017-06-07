var React = require('react'),
    Highcharts = require('react-highcharts'),
    _ = require('underscore');

module.exports = Chart = React.createClass({

    getDefaultProps() {
        return {
            config: {
                chart: {
                    type: 'bar'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: 'Top bots stat'
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
