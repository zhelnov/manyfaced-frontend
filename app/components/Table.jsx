var React = require('react'),
    Select = require('./Select.jsx'),
    _ = require('underscore');

module.exports = Table = React.createClass({

    getDefaultProps() {
        return {
            rows: [],
            columns: [],
            techKeys: ['color'],
            perPageValues: [5, 10, 25, 50, 100],            
            perPage: 10,
            checkbox: true,
            onPerPageChange: function () {}
        };
    },

    onPerPageChange(e) {
        this.setState({perPage: e.target.value});
        this.props.onPerPageChange(e.target.value);
    },

    onCheckboxChanged(e) {
        debugger;
    },

    renderRow(isHead, row) {
        var output = Object.keys(row).map((column, index) => {
                if (this.props.techKeys.indexOf(column) === -1) {
                    // костыль сделать нормально
                    if (column === 'country' && row[column] && !isHead) {
                        var pic = 'https://whoer.net/images/flags/' + row[column].toLowerCase() + '.png';
                        return (<td key={column}><img src={pic} /> ({row[column]})</td>);
                    }
                    return <td key={column}>{row[column]}</td>;
                }
            }).filter(Boolean),
            style = {backgroundColor: row.color};

        if (this.props.checkbox) {
            output = [
                <td key={row.color + 'checkbox'} style={style}>
                    <input type="checkbox" onChange={this.onCheckboxChanged} />
                </td>
            ].concat(output);
        }

        return <tr key={row.color}>{output}</tr>;
    },

    renderRows(items) {
        return items.map(this.renderRow.bind(this, false));
    },

    render() {
        return (
            <div>
                <table>
                    <thead>{this.renderRow(true, this.props.columns)}</thead>
                    <tbody>{this.renderRows(this.props.rows)}</tbody>
                </table>
                Items per load: <Select
                    className="table__perpage-select"
                    defaultVal={this.props.perPage}
                    options={this.props.perPageValues}
                    onChange={this.onPerPageChange}
                />
            </div>
        );
    }

});
