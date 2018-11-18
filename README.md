# pusudb-use-ejs

> Middleware to serve ejs view-engine files with the pusudb-framework.

This middleware adds a file-handler to the pusudb-framework to render [ ejs-files ]( https://ejs.co/).

Framework: [ pusudb ](https://www.npmjs.com/package/pusudb)

<a name="installing"></a>
## Installing

```sh
npm install pusudb-use-ejs --save
```

## Use
Define the path where the ejs-files are located. Define some url's which should be escaped. To define a url-prefix use the option prefix.

### Single query
* http://localhost:3000/ejs/index/api/db/stream
* <%= data => and <%= err => in ejs-file

### Multiple queries
* http://localhost:3000/ejs/index/api/select/list?nav=db,stream&user=db,get,key+person:AEYC8Y785 
* <%= nav => and <%= user => in ejs-file


```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost', { log : true, prefix : '/api'})

var EjsMiddleware = require('pusudb-use-ejs')
var ejsMiddlewareRender = new EjsMiddleware(__dirname + '/ejs', ['/static', /* blocked pathnames */], { prefix : '/ejs' }) 

//add the middleware to the pusudb
pusudb.use('http', ejsMiddlewareRender.serve)


pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```


### HTML Example
URL: 'http://localhost:3000/[middleware-prefix]/[filename]/[pusudb-prefix]/[database-name]/[meta]'
Example: 'http://localhost:3000/ejs/index/api/db/stream'

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="author" content="">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

  <p>Hello, world!</p>
  <p><%= JSON.stringify(data) %></p>

</body>

</html>
```
<a name="authors"></a>

## Authors

* **Yannick Grund** - *Initial work* - [yamigr](https://github.com/yamigr)

<a name="license"></a>

## License

This project is licensed under the MIT License

