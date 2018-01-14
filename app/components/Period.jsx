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
        return {
            startDate: moment().startOf('day').subtract(1, 'week'),
            endDate: moment().startOf('day')
        };  
    },

    componentDidMount() {
        this.props.onChange(this.state);
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
            <div className="period">
                From <DatePicker
                        className="startDate"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.startDate}
                        onChange={this.startChanged} />
                to  <DatePicker
                        className="endDate"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.endDate}
                        onChange={this.endChanged} />
		<div className="explanation">Date range filter</div>
            </div>
        );
    }
});
