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
            checkbox: true
        };
    },

    onPerPageChange(e) {
        this.setState({perPage: e.target.value});
    },

    onCheckboxChanged(e) {
        debugger;
    },

    renderRow(isHead, row) {
        var output = Object.keys(row).map((column, index) => {
                if (this.props.techKeys.indexOf(column) === -1) {
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
                Записей на страницу: <Select
                    className="table__perpage-select"
                    defaultVal={this.props.perPage}
                    options={this.props.perPageValues}
                    onChange={this.onPerPageChange}
                />
                <table>
                    <thead>{this.renderRow(true, this.props.columns)}</thead>
                    <tbody>{this.renderRows(this.props.rows)}</tbody>
                </table>
            </div>
        );
    }

});
