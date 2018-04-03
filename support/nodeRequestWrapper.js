const zomatoHostname = 'https://developers.zomato.com';
const zomatoCitiesPath = '/api/v2.1/cities';
const defMethod = 'GET';
var apiKey = require('../apiKey');

module.exports.testBuilder = testBuilder;
module.exports.doRequest = setup;

function setup(options, cb) {
    var preparedOptions = prepareOpt(options);
    makeCall(preparedOptions, (err, res) => {
        if (err) cb(err);
        cb(null, res);
    });
}

function prepareOpt(options) {
    var urlObject = buildUrl(options);
    var headers = {
        'user-key': apiKey
    }
    return {
        method: options.method,
        headers: headers,
        path: urlObject.path,
        hostname: urlObject.hostname,
        port: urlObject.port,
        protocol: urlObject.protocol
    }
}

function testBuilder(options, cb) {
    var url = buildUrl(options);
    cb(null, url);
}

function buildUrl(options) {
    var queryObj = options.queryObj;
    var queryKeys = Object.keys(queryObj);
    var query = `${options.hostname}${options.path}?`;
    queryKeys.forEach((key, index) => {
        if (typeof queryObj[key] == 'string') {
            query += `${key}=${queryObj[key]}`;
        } else {
            query += `${key}=${queryObj[key].join()}`;
        }
        if (index < queryKeys.length - 1) query += '&';
    });
    return require('url').parse(query);
}

function makeCall(options, cb) {
    var protocol = options.protocol.replace(':', '');
    var req = require(protocol).request(options, (res) => {
        res.responseBuffer = '';
        res.setEncoding('utf8');
        res.on('data', (data) => {
            res.responseBuffer += data;
        });
        res.on('end', () => {
            cb(null, res);
        });
    }).on('error', (error) => {
        console.log('error??');
        cb(error);
    });
    req.write('');
    req.end();
}
