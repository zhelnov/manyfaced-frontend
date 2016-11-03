var clickhouse = require('./clickhouse-wrapper'),
    Query = require('./query');

module.exports = {

    TABLE: 'Honeypot.bearrequests',

    getTopBots: function (limit) {
        var query = this._createQuery()
            .select({
                count: 'count(*)',
                ip: 'BotIP',
                country: 'BotCountry'
            })
            .from(this.TABLE)
            .groupby(['BotIP', 'BotCountry'])
            .having('count > 10')
            .orderby('count', true)
            .limit(limit || 50);

        return this._execQuery(query);
    },

    getLastHits: function () {
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
