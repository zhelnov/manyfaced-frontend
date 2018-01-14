var React = require('react'),
    Table = require('./Table.jsx'),
    Chart = require('./Chart.jsx'),
    Period = require('./Period.jsx'),
    Select = require('./Select.jsx'),
    jQuery = require('jquery'),
    Link = require('react-router').Link;

module.exports = MultiReport = React.createClass({

    getDefaultProps() {
        return {
            apiEndpoint: '/multireportdata',
	    presets: ['requestpath', 'useragent', 'botcountry', 'smbrequestpath']
        };
    },

    getInitialState() {
        return {
            rows: [],
		columns: {one: 'NUMBER', two: 'VALUE'}
        };
    },

    fetch(preset) {
        return jQuery.ajax(this.props.apiEndpoint, {
            method: 'get',
            data: {
		preset: preset || this.props.presets[0]
	    }
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
        var newRows = response.map(row => {
                row.color = this.getRandomColor();
                return row;
            });

        this.setState({
            rows: newRows
        });

            var $doc = jQuery(document);
            $doc.scrollTop($doc.height());
    },

     onPresetChange(e) {
        this.fetch(e.target.value).then(this.updateData);
    },

    render() {
        return (
            <div>
<h1>Honeypot statistics</h1>
                Statistics preset: <Select
                    options={this.props.presets}
                    onChange={this.onPresetChange}
                />
                <Table
                    rows={this.state.rows}
                    columns={this.state.columns}
                />
            </div>
        );
    }

});
