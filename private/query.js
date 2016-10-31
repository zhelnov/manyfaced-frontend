var Query = function () {
    this._query = '';

    // map same multi-argument operators
    ['select', 'from', 'as', 'from', 'group by'].forEach(function (operator) {
        this[operator.replace(' ', '')] = function (input) {
            this._multiOperator(operator, input);
            return this;
        }.bind(this);
    }, this);
};

Query.prototype._stringOrArray = function (value) {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return String(value);
};

Query.prototype._multiOperator = function (operator, input) {
    this._query += ' ' + operator + ' ' + this._stringOrArray(input);
};

Query.prototype.orderby = function (input, isDesc) {
    this._multiOperator('order by', input) + (isDesc ? ' desc' : '');
    return this;
};

Query.prototype.where = function () {
    throw new Error('not implemented');
};

Query.prototype.serialize = function () {
    return this._query;
};

module.exports = Query;
