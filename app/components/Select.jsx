var React = require('react');

module.exports = React.createClass({

    render: function () {
        return(
            <select 
                defaultValue={this.props.defaultVal}
                value={this.props.selected}
                onChange={this.props.onChange}
            >
                {this.props.options.map(function (val) {
                    return <option value={val} key={val}>{val}</option>;
                }, this)}
            </select>
        )
    }

});
