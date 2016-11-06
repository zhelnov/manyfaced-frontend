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

module.exports = function (app) {
    app.post('/topbots', handlerFactory('getTopBots', function (body) {
        if (!body.from || !body.to) {
            return {};
        }

        return {
            period: {
                from: moment(body.from),
                to: moment(body.to)
            }
        };
    }));

    app.post('/lasthits', handlerFactory('getLastHits'));
};
