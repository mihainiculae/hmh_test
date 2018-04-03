var apiKey = require("../apiKey");

module.exports.testBuilder = testBuilder;
module.exports.doRequest = doRequest;

function doRequest(options, cb) {
    var preparedOptions = prepareOpt(options);
    var protocol = preparedOptions.protocol.replace(":", "");
    var req = require(protocol)
        .request(preparedOptions, res => {
            res.responseBuffer = "";
            res.setEncoding("utf8");
            res.on("data", data => {
                res.responseBuffer += data;
            });
            res.on("end", () => {
                cb(null, res);
            });
        })
        .on("error", error => {
            console.log("error??");
            cb(error);
        });
    req.write("");
    req.end();
}

function prepareOpt(options) {
    var urlObject = buildUrl(options);
    var headers = {};
    if (options.useKey) {
        headers["user-key"] = apiKey;
    }

    return {
        method: options.method,
        headers: headers,
        path: urlObject.path,
        hostname: urlObject.hostname,
        port: urlObject.port,
        protocol: urlObject.protocol
    };
}

function buildUrl(options) {
    var queryObj = options.queryObj;
    var queryKeys = Object.keys(queryObj);
    var query = `${options.hostname}${options.path}?`;
    queryKeys.forEach((key, index) => {
        if (typeof queryObj !== "array") {
            query += `${key}=${queryObj[key]}`;
        } else {
            query += `${key}=${queryObj[key].join()}`;
        }
        if (index < queryKeys.length - 1) query += "&";
    });
    return require("url").parse(query);
}

function testBuilder(options, cb) {
    var url = buildUrl(options);
    cb(null, url);
}
