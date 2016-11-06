var React = require('react'),
    Table = require('./Table.jsx'),
    Chart = require('./Chart.jsx'),
    Period = require('./Period.jsx'),
    jQuery = require('jquery'),
    Link = require('react-router').Link;

module.exports = Report = React.createClass({

    getDefaultProps() {
        return {
            apiEndpoint: '/topbots',
            columns: {
                count: 'Кол-во',
                ip: 'Адрес',
                country: 'Код страны'
            }
        };
    },

    getInitialState() {
        return {
            rows: []
        };
    },

    componentDidMount() {
        this.fetch();
    },

    fetch(options) {
        jQuery
            .ajax(this.props.apiEndpoint, {
                method: 'get',
                data: options || {}
            })
            .done(function (rows) {
                this.setState({
                    rows: rows.map(row => {
                        row.color = this.getRandomColor();
                        return row;
                    })
                });
            }.bind(this));
    },

    getRandomColor() {
        var letters = '0123456789ABCDEF',
            color = '#';

        for (var i=0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    },

    buildChartOptions() {
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
            <div>
                Reports: <Link to={'/load'}>Load report</Link>
                <Chart params={this.buildChartOptions()} />
                <Period onChange={this.onPeriodChange} />
                <Table
                    rows={this.state.rows}
                    columns={this.props.columns}
                />
            </div>
        );
    }

});
