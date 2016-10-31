/**
 * Example script for CH connection test wrapped by promise
 */
(function () {
    var config = require('./../configs/connection.json'),
        ClickHouse = require('./../node_modules/clickhouse/index.js'),
        db = new ClickHouse({
            url: config.clithouse.host,
            port: config.clithouse.port,
            debug: false
        });

    var promiseQuery = function (queryString) {
        return new Promise(function (fulfill, reject) {
            db.query(queryString, function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }
                fulfill(result);
            });
        });
    };

    promiseQuery('select count(*) from Honeypot.bearrequests')
        .then(function (rows) {
            console.log('Query result: ', rows);
        })
        .catch(function (error) {
            console.error('Query failed: ', error);
        });

})();
