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

Create a ejs-instance and define the path where the ejs view-engine files are located. Define some url's which should be escaped to put the request direct to the pusudb. When the ejs view-engine files are located in different folders, put option multipath to true. Please notice, that the filename should be unique, even when the folder is different.

Example:
http://localhost:3000/render/index/db/stream

* in the defined path exists the file ./render/index.ejs
* db is the database-name where the data is stored
* stream is the meta-action to query the database [https://www.npmjs.com/package/pusudb](https://www.npmjs.com/package/pusudb)
* in the ejs-file the result can be accessed with <%= data => or <%= err =>

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var EjsMiddleware = require('pusudb-use-ejs')
var ejsMiddlewareRender = new EjsMiddleware(__dirname + '/view', ['/static', /* blocked pathnames */], { prefix : '/path' }) 

//add the middleware to the pusudb
pusudb.use('http', ejsMiddlewareRender.serve)


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

