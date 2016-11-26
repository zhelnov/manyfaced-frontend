var api = require('./data'),
    moment = require('moment'),
    _ = require('underscore');

function handlerFactory(apiMethod, paramsFormatter) {
    return function (req, res) {
        var options = {};

        if (typeof req.query.offset !== 'undefined') {
            options.offset = Number(req.query.offset);
        }
        if (typeof req.query.limit !== 'undefined') {
            options.limit = Number(req.query.limit);
        }
        if (typeof paramsFormatter === 'function') {
            options = _.extend({}, options, paramsFormatter(req.query));
        }
        console.log(options);
        api[apiMethod](options)
            .then(function (json) {
                res.json(json);
            })
            .catch(function (error) {
                console.error(error);
                res.json({error: 'Error with data processing!'});
            });
    };
}

function periodFormatter(params) {
    if (!params.from || !params.to) {
        return {};
    }
    if (!moment(params.from, 'Y-M-DD').isValid()
        || !moment(params.to, 'Y-M-DD').isValid()) {
        throw new Error('Invalid period');
    }

    return {
        period: {
            from: params.from,
            to: params.to
        }
    };
}

module.exports = function (app) {
    app.get('/topbots', handlerFactory('getTopBots', periodFormatter));
    app.get('/loadstats', handlerFactory('getLoadStats', periodFormatter));
    app.get('/lasthits', handlerFactory('getLastHits'));
};
