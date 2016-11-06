var React = require('react'),
    DatePicker = require('react-datepicker'),
    moment = require('moment');

module.exports = Period = React.createClass({

    getDefaultProps() {
        return {
            onChange: function () {}
        };
    },

    getInitialState() {
        var stamp = moment().startOf('day');

        return {
            startDate: stamp,
            endDate: stamp
        };  
    },

    mergeConfig() {
        return _.extend({}, this.props.config, this.props.params);
    },

    startChanged(value) {
        this.state.startDate = value;
        this.props.onChange(this.state);
    },

    endChanged(value) {
        this.state.endDate = value;
        this.props.onChange(this.state);
    },

    render() {
        return (
            <div>
                Start: <DatePicker
                        className="startDate"
                        dateFormat="DD.MM.YYYY"
                        selected={this.state.startDate}
                        onChange={this.startChanged} />
                End: <DatePicker
                        className="endDate"
                        dateFormat="DD.MM.YYYY"
                        selected={this.state.endDate}
                        onChange={this.endChanged} />
            </div>
        );
    }
});