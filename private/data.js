var clickhouse = require('./clickhouse-wrapper'),
    Query = require('./query'),
    moment = require('moment');

function formatDate(momentInstance) {
    return momentInstance.format('Y-M-DD');
}

function periodToCondition(period) {
    return 'EventDate >= toDate(\'' + period.from + '\') and EventDate <= toDate(\'' + period.to + '\')';
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
            .from(this.TABLE);

        if (options.period) {
            query.where(periodToCondition(options.period));
        }

        query
            .groupby(['BotIP', 'BotCountry'])
            .orderby('count', true);

        if (options.limit) {
            query.limit(options.limit);
        }

        return this._execQuery(query);
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

    _createQuery: function () {
        return new Query();
    },

    _execQuery: function (instance) {
        var raw = instance.serialize();
        console.log('QUERY: ' + raw);
        return clickhouse(raw);
    }
};
