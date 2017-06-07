var clickhouse = require('./clickhouse-wrapper'),
    Query = require('./query'),
    moment = require('moment');

function formatDate(input) {
    if (input instanceof moment) {
        return input.format('Y-MM-DD');
    }
    return moment(input).format('Y-MM-DD');
}

function periodToCondition(period) {
    var from = formatDate(period.from),
        to = formatDate(period.to);
    return 'EventDate >= toDate(\'' + from + '\') and EventDate <= toDate(\'' + to + '\')';
}

function createBytimeTable(period) {
    var table = [],
        from = moment(period.from).startOf('day'),
        to = moment(period.to).startOf('day').add(1, 'days');

    if (from.isAfter(to)) {
        throw new Error('Wrong periods!');
    }
    while(!to.isSame(from)) {
        table.push(formatDate(from));
        from.add(1, 'days');
    }

    return table;
}

module.exports = {

    TABLE: 'Honeypot.bearrequests',

    getLoadStats: function (options) {
        var query = this._createQuery()
            .select({
                count: 'count(*)',
                date: 'EventDate'
            })
            .from(this.TABLE);

        if (options.period) {
            query.where(periodToCondition(options.period));
        }
        query.groupby('EventDate');

        return this._execQuery(query).then(rows => {
            if (!options.period) {
                return rows;
            }

            return createBytimeTable(options.period).map(day => {
                var matchRow = rows.find(row => {
                        return row.date === day;
                    });

                if (matchRow) {
                    return matchRow;
                }

                return {
                    count: 0,
                    date: day
                };
            });
        });
    },

    getTopBots: function (options) {
        var query = this._createQuery()
            .select({
                count: 'count(*)',
                ip: 'BotIP',
                country: 'BotCountry'
            })
            .from(this.TABLE),
            countQuery;

        if (options.period) {
            query.where(periodToCondition(options.period));
        }

        query
            .groupby(['BotIP', 'BotCountry'])
            .orderby('count', true);

        countQuery = this._getCountQuery(query);

        if (options.limit) {
            query.limit(
                typeof options.offset === 'undefined' ? 0 : options.offset,
                options.limit
            );
        }

        return Promise.all([
            this._execQuery(query),
            this._execQuery(countQuery)
        ]).then(values => {
            var total = values[1][0].total,
                rows = values[0];

            return {
                total: total,
                rows: rows
            };
        });
    },

    getLastHits: function (options) {
        var query = this._createQuery()
            .select([
                'ProbeName', 
                'BotIP',
                'BotCountry',
                'RequestCommand',
                'RequestPath',
                'BotUA',
                'BotDNSName'
            ])
            .from(this.TABLE)
            .orderby('RequestTime', true);

        return this._execQuery(query);
    },

    _getCountQuery: function (query) {
        return this._createQuery()
            .select({total: 'count(*)'})
            .from(query);
    },

    _createQuery: function () {
        return new Query();
    },

    _execQuery: function (instance) {
        var raw = instance.serialize();
        console.log('QUERY: ' + raw);
        return clickhouse(raw);
    }
};
