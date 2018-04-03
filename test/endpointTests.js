const assert = require('assert');
const request = require('../support/nodeRequestWrapper');

const citiesPath = '/api/v2.1/cities';
const zomatoHostname = 'https://developers.zomato.com';
const expectedObjectFields = ['location_suggestions', 'status', 'has_more', 'has_total']
const expectedLocationFields = ['id', 'name', 'country_id', 'country_name', 'is_state', 'state_id', 'state_name', 'state_code'];

describe('Acceptance tests', function() {
    describe('When requesting via known city name query (Dublin)', function() {
        it('Info for the requested city is returned', function(done) {
            var requestObject = {
                path: citiesPath,
                hostname: zomatoHostname,
                method: 'get',
                queryObj: {
                    q: 'Dublin'
                }
            }
            request.doRequest(requestObject, function(e, r) {
                if (e) done(e);
                done(checkOkCitiesResponse(r));
            });
        });
    });
    describe('When requesting info for Dublin city via latitude and longitude', function() {
        it('Info for the requested city is returned', function(done) {
            var requestObject = {
                path: citiesPath,
                hostname: zomatoHostname,
                method: 'get',
                queryObj: {
                    lat: 53.3498,
                    lon: -6.2603
                }
            }
            request.doRequest(requestObject, function(e, r) {
                if (e) done(e);
                done(checkOkCitiesResponse(r));
            });
        });
    });
    describe('When requesting city by city id', function() {
        it('Info for the requested city is returned', function(done) {
            var requestObject = {
                path: citiesPath,
                hostname: zomatoHostname,
                method: 'get',
                queryObj: {
                    city_ids: ['306']
                }
            }
            request.doRequest(requestObject, function(e, r) {
                if (e) done(e);
                done(checkOkCitiesResponse(r));
            });
        });
    });
    describe('When requesting multiple cities by city id', function() {
        it('Info for the requested cities is returned', function(done) {
            var city_ids = ['306', '280']
            var requestObject = {
                path: citiesPath,
                hostname: zomatoHostname,
                method: 'get',
                queryObj: {
                    city_ids: city_ids
                }
            }
            request.doRequest(requestObject, function(e, r) {
                if (e) done(e);
                var resAsJson = JSON.parse(r.responseBuffer);
                var notFound = [];
                resAsJson.location_suggestions.forEach(location => {
                    if (!city_ids.includes(location.id.toString())) notFound.push(location.name);
                });
                assert.equal(notFound.length, 0, `${notFound} was not found in the response!`)
                done(checkOkCitiesResponse(r));
            });
        });
    });
    describe('When requesting for cities specifying a max count', function() {
        it('the response should not surpass that max count', function(done) {
            var maxCities = 3;
            var idArray = [];
            for (let i = 0; i < 100; i++) {
                idArray.push(i.toString);
            }
            var requestObject = {
                path: citiesPath,
                hostname: zomatoHostname,
                method: 'get',
                queryObj: {
                    count: maxCities,
                    q: 'San Francisco'
                }
            }
            request.doRequest(requestObject, function(e, r) {
                if (e) done(e);
                var resAsJson = JSON.parse(r.responseBuffer);
                assert.ok(maxCities === resAsJson.location_suggestions.length, `The number of cities returned did not match what we sent. got ${resAsJson.location_suggestions.length}`)
                done(checkOkCitiesResponse(r));
            });
        });
    });
});

function checkOkCitiesResponse(response) {
    var resAsJson = JSON.parse(response.responseBuffer);
    var errorsFound = [];
    if (resAsJson.status !== 'success') errorsFound.push(`The query was not a success`);
    if (resAsJson.location_suggestions.length === 0) errorsFound.push(`No results were returned!`);
    var undefinedKeys = returnUndefinedKeys(resAsJson, expectedObjectFields);
    if (undefinedKeys.length !== 0) errorsFound.push(`Some keys in the response object were undefined: ${undefinedKeys} were undefined`);
    resAsJson.location_suggestions.forEach(suggestion => {
        let undefKeys = returnUndefinedKeys(suggestion, expectedLocationFields);
        if (undefKeys.length !== 0) errorsFound.push(`Some keys in a location suggestion object were undefined: ${undefKeys} were undefined`);
    });
    return (errorsFound.length !== 0) ? new Error(errorsFound) : null;
}

function returnUndefinedKeys(citiesObject, checkArray) {
    var resultsArray = [];
    checkArray.forEach(key => {
        if (citiesObject[key] === undefined) resultsArray.push(key);
    });
    return resultsArray;
}
