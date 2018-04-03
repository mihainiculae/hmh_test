### Installing:
- Clone the Project
- 'npm install' in the root of the project

### Configuring:
The zomato API key is not hardcoded, in order to use a key you must create a file named 'apiKey' in the root folder. The file should contain only the following line:
```javascript
module.exports = 'YourAPIKey'
```
replace YourAPIKey with your Zomato API key and you're good to go

### Starting Tests
All:
```
npm test test/
```

Just Wrapper tests:
```
npm test/wrapperTests
```

Just Endpoint tests:
```
npm test/endpointTests
```
