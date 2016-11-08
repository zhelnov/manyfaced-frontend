var api = require('./data'),
    moment = require('moment');

function handlerFactory(apiMethod, paramsFormatter) {
    return function (req, res) {
        api[apiMethod](paramsFormatter ? paramsFormatter(req.query) : {})
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

    return {
        period: {
            from: moment(params.from).startOf('day'),
            to: moment(params.to).startOf('day')
        }
    };
}

module.exports = function (app) {
    app.get('/topbots', handlerFactory('getTopBots', periodFormatter));
    app.get('/loadstats', handlerFactory('getLoadStats', periodFormatter));
    app.get('/lasthits', handlerFactory('getLastHits'));
};
