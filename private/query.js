var Query = function () {
    this._query = '';

    // map same multi-argument operators
    ['from', 'from', 'group by'].forEach(function (operator) {
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
    this._multiOperator(' order by', input);
    if (isDesc) {
        this._query += ' desc';
    }
    return this;
};

Query.prototype.select = function (input) {
    if (typeof input === 'object') {
        var result = 'select';
        Object.keys(input).forEach(function (key) {
            result += ' ' + String(input[key]) + ' as ' + String(key) + ',';
        });
        this._query = result.slice(0, -1);
    } else {
        this._multiOperator('select', input);
    }
    return this;
};

Query.prototype.where = function (condition) {
    this._query += ' where ' + String(condition);
    return this;
};

Query.prototype.having = function (condition) {
    this._query += ' having ' + String(condition);
    return this;
};

Query.prototype.limit = function (input) {
    this._query += ' limit ' + Number(input);
    return this;
};

Query.prototype.serialize = function () {
    return this._query;
};

module.exports = Query;
