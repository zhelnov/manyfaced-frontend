var clickhouse = require('./clickhouse-wrapper'),
    Query = require('./query'),
    moment = require('moment');

function periodToCondition(period) {
    var format = 'Y-M-DD',
        from = period.from.format(format),
        to = period.to.format(format);

    return 'EventDate between toDate(\'' + from + '\') and toDate(\'' + to + '\')';
}

module.exports = {

    TABLE: 'Honeypot.bearrequests',

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
