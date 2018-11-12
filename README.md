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

Create a ejs-instance and define the path where the ejs view-engine files are located. Define some url's which should be escaped to put the request direct to the pusudb.

### Single query
http://localhost:3000/render/index/db/stream then use the data in the ejs-file with <%= data => or <%= err =>

### Multiple queries
http://localhost:3000/ejs/index/api/select/list?nav=db,stream&user=db,get,key+person:AEYC8Y785 then use the data in the ejs-file with <%= nav => or <%= user =>
Explaining: nav=db,stream 'nav' is a key to identify the data in the ejs-file. The key should be unique per request. The db is the database name and the stream is the meta action to query the database


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

