var api = require('./data'),
    moment = require('moment');

function handlerFactory(apiMethod, paramsFormatter) {
    return function (req, res) {
        api[apiMethod](paramsFormatter ? paramsFormatter(req.body) : {})
            .then(function (json) {
                res.json(json);
            })
            .catch(function (error) {
                console.error(error);
                res.json({error: 'Error with data processing!'});
            });
    };
}

function periodFormatter (body) {
        if (!body.from || !body.to) {
            return {};
        }

        return {
            period: {
                from: moment(body.from),
                to: moment(body.to)
            }
        };
    }

module.exports = function (app) {
    app.get('/topbots', handlerFactory('getTopBots', periodFormatter));
    app.get('/loadstats', handlerFactory('getLoadStats', periodFormatter));
    app.get('/lasthits', handlerFactory('getLastHits'));
};
