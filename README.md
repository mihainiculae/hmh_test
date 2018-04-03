### Small Introduction
A few tests done on the cities endpoint that zomato supplies, harnessed by mocha.

I built the wrapper tests to get used to mocha and test some functions

### Installing:
- Clone the project then
```
'npm install'
```

### Configuring:
The zomato API key is not hardcoded, in order to use a key you must create a file named 'apiKey' in the root folder. The file should contain only the following line:
```javascript
module.exports = 'YourAPIKey'
```
replace YourAPIKey with your Zomato API key and you're good to go

### Starting Tests
```
npm test test/
npm test test/wrapperTests
npm test test/endpointTests
```
