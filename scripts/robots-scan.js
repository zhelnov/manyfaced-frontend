/**
 * Example script to ping robots.txt routes
 */
(function () {
    var request = require('request-promise'),
        domain = 'http://localhost';

    request(domain + '/robots.txt')
        .then(function (robots) {
            var hosts = robots.split('\n'),
                exclude = 'Disallow: ';

            hosts
                .map(function (host) {
                    if (host.indexOf(exclude) !== -1) {
                        return host.replace(exclude, '').replace('\r', '');
                    }
                })
                .filter(Boolean)
                .forEach(function (host) {
                    var point = domain + host;

                    request(point)
                        .then(function () {
                            console.log(point + ' OK');
                        })
                        .catch(function (error) {
                            console.log(point + ' ERROR: ' + error);
                        });
                });
        })
        .catch(function (error) {
            console.log(error);
        });
})();
