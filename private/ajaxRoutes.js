var api = require('./data');

function processApi(method, res) {
    api[method]()
        .then(function (json) {
            res.json(json);
        })
        .catch(function (error) {
            console.error(error);
            res.json({error: 'Error with data processing!'});
        });
}

module.exports = function (app) {

    app.get('/topbots', function(req, res) {
        processApi('getTopBots', res);
    });

    app.get('/lasthits', function(req, res) {
        processApi('getLastHits', res);
    });
};
