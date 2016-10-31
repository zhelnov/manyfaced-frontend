var config = require('./../configs/connection.json'),
    ClickHouse = require('./../node_modules/clickhouse/index.js'),
    clickHouseInstance = new ClickHouse({
        url: config.clithouse.host,
        port: config.clithouse.port,
        debug: false
    });

/**
 * Promised call to ClickHouse library
 * @param {String} queryString
 * @returns {Promise}
 */
module.exports = function (queryString) {
    return new Promise(function (fulfill, reject) {
        clickHouseInstance.query(queryString, function (error, result) {
            if (error) {
                reject(error);
            } else {
                fulfill(result);
            }
        });
    });
};
