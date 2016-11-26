var Query = function () {
    this._query = '';
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

Query.prototype.from = function (input) {
    if (input instanceof Query) {
        this._query += ' from (' + input.serialize() + ')';
    } else {
        this._multiOperator('from', input);
    }
    return this;
};

Query.prototype.groupby = function (input) {
    this._multiOperator('group by', input);
    return this;
};

Query.prototype.orderby = function (input, isDesc) {
    this._multiOperator('order by', input);
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

Query.prototype.limit = function (offset, limit) {
    this._query += ' limit ' + Number(offset) + ', ' + Number(limit);
    return this;
};

Query.prototype.serialize = function () {
    return this._query;
};

module.exports = Query;
