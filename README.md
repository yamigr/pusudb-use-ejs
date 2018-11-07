# pusudb-use-ejs

> Middleware to serve ejs view-engine files with the pusudb-framework.

This middleware adds a file-handler to the pusudb-framework to render ejs view-engine files and sending it to the client.

Framework: [https://www.npmjs.com/package/pusudb](https://www.npmjs.com/package/pusudb)

<a name="installing"></a>
## Installing

```sh
npm install pusudb-use-ejs --save
```

## Use

Create a ejs-instance and define the path where the ejs view-engine files are located. Define some url's which should be escaped to put the request to the pusudb. When the ejs view-engine files are located in different folders, put option multipath to true. Please notice, that the filename should be unique, even when the folder is different.

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var EjsMiddleware = require('pusudb-use-ejs')
var ejsMiddlewareRender = new EjsMiddleware(__dirname + '/render', ['/static'], { multipath : true }) 
var ejsMiddlewareEjs = new EjsMiddleware(__dirname + '/ejs', ['/static'], { multipath : false })

// new Static(< path to the ejs view-engine files >, < array of url's to escape when a get-request fired >)
// http://localhost:3000/index.html the main-path is not necessary in the url
//add the middleware to the pusudb
pusudb.use('http', ejsMiddlewareRender.serve)
pusudb.use('http', ejsMiddlewareEjs.serve)

pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```
<a name="authors"></a>

## Authors

* **Yannick Grund** - *Initial work* - [yamigr](https://github.com/yamigr)

<a name="license"></a>

## License

This project is licensed under the MIT License

