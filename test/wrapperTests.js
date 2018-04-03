const assert = require('assert');
const request = require('../support/nodeRequestWrapper');
// call done() when done
// call with parameter for errors
// assert will be caught by default

describe('Test the wrapper', function() {
    describe('When giving the wrapper an object with query params', function() {
        it('should return a valid url composed of those', function(done) {
            var requestObject = {
                path: '/api/v2.1/cities',
                hostname: 'https://developers.zomato.com',
                method: 'get',
                queryObj: {
                    q: 'Bucharest'
                }
            }
            request.testBuilder(requestObject, function(err, res) {
                if (err) done(err);
                assert(res !== undefined, 'res was undefined');
                assert(res.host !== undefined, 'host field was undefined');
                assert(res.query !== undefined, 'query field was undefined');
                assert(res.path !== undefined, 'path field was undefined');
                assert(res.path.indexOf('&') === -1, 'path was malformed, should have not contained ampersand and it did');
                done();
            });
        });
    });
    describe('When giving the wrapper an object with multiple query params', function() {
        it('should return a valid url composed of those', function(done) {
            var requestObject = {
                path: '/api/v2.1/cities',
                hostname: 'https://developers.zomato.com',
                method: 'get',
                queryObj: {
                    q: 'Bucharest',
                    lat: '100',
                    lon: '100',
                    count: '100'
                }
            }
            request.testBuilder(requestObject, function(err, res) {
                if (err) done(err);
                // console.log(res);
                assert(res !== undefined, 'res was undefined');
                assert(res.host !== undefined, 'host field was undefined');
                assert(res.query !== undefined, 'query field was undefined');
                assert(res.path !== undefined, 'path field was undefined');
                assert(res.path.indexOf('&') !== -1, 'path was malformed, should have contained ampersand and did not')
                done();
            });
        });
    });
    describe('When giving the wrapper an object with multiple query params and an array query', function() {
        it('should return a valid url composed of those', function(done) {
            var requestObject = {
                path: '/api/v2.1/cities',
                hostname: 'https://developers.zomato.com',
                method: 'get',
                queryObj: {
                    q: 'Bucharest',
                    lat: '100',
                    lon: '100',
                    count: '100',
                    city_ids: ['firstId', 'secondId', 'thirdId']
                }
            }
            request.testBuilder(requestObject, function(err, res) {
                if (err) done(err);
                assert(res !== undefined, 'res was undefined');
                assert(res.host !== undefined, 'host field was undefined');
                assert(res.query !== undefined, 'query field was undefined');
                assert(res.path !== undefined, 'path field was undefined');
                assert(res.path.indexOf('&') !== -1, 'path was malformed, should have contained ampersand and did not')
                assert(res.path.indexOf(',') !== -1, 'path was malformed, should have had commas between city_ids')
                done();
            });
        });
    });
    describe(' When making a simple call to zomato/cities for San Francisco', function() {
        it('should return a ok response with data pertaining to San Francisco', function(done) {
            var requestObject = {
                path: '/api/v2.1/cities',
                hostname: 'https://developers.zomato.com',
                method: 'get',
                queryObj: {
                    q: 'San Francisco'
                }
            }
            request.doRequest(requestObject, function(err, res) {
                if (err) done(err);
                assert(res.statusCode === 200, `the response status code was not 200 but was ${res.statusCode}`);
                assert(res.responseBuffer.length > 0, 'the response body was empty')
                assert(res.responseBuffer.indexOf('San Francisco') !== -1, '"San Francisco" was not contained in the response');
                done();
            });
        });
    });
});
