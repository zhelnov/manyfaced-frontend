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
                country: 'Страна'
            }
        };
    },

    getInitialState() {
        return {
            period: {},
            offset: 0,
            limit: 10, //hack bad bad
            total: 0,
            rows: []
        };
    },

    fetch(options) {
        return jQuery.ajax(this.props.apiEndpoint, {
            method: 'get',
            data: options || {}
        });
    },

    getRandomColor() {
        var letters = '0123456789ABCDEF',
            color = '#';

        for (var i=0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    },

    updateData(response) {
        var isNew = this.state.offset === 0;
            newRows = response.rows.map(row => {
                row.color = this.getRandomColor();
                return row;
            });

        this.setState({
            offset: this.state.offset + this.state.limit,
            total: response.total,
            rows: isNew ? newRows : this.state.rows.concat(newRows)
        });

        if (!isNew) {
            var $doc = jQuery(document);
            $doc.scrollTop($doc.height());
        }
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

    perPageChanged(value) {
        this.setState({limit: Number(value)});
    },

    onPeriodChange(period) {
        var period = {
            from: period.startDate.toJSON(),
            to: period.endDate.toJSON()
        };
        this.setState({
            offset: 0,
            period: period
        });
        this
            .fetch({
                from: period.from,
                to: period.to,
                offset: 0,
                limit: this.state.limit
            })
            .then(this.updateData);
    },

    onMoreClick() {
        this
            .fetch({
                from: this.state.period.from,
                to: this.state.period.to,
                offset: this.state.offset,
                limit: this.state.limit
            })
            .then(this.updateData);  
    },

    renderPagination: function () {
        if (this.state.total - 1 <= this.state.rows.length) {
            return (<div>All {this.state.total} items showed</div>);
        }
        return (
            <div>
            Showed {this.state.offset} of {this.state.total}
            <button onClick={this.onMoreClick}>Moar...</button>
            </div>
        );
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
                    onPerPageChange={this.perPageChanged}
                />
                {this.renderPagination()}
            </div>
        );
    }

});
