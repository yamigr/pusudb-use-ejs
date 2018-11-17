# pusudb-use-ejs

> Middleware to serve ejs view-engine files with the pusudb-framework.

This middleware adds a file-handler to the pusudb-framework to render ejs view-engine files.

Framework: [https://www.npmjs.com/package/pusudb](https://www.npmjs.com/package/pusudb)
EJS: [ https://ejs.co/]( https://ejs.co/)

<a name="installing"></a>
## Installing

```sh
npm install pusudb-use-ejs --save
```

## Use

Define the path where the static-files are located. Define some url's which should be escaped. To define a url-prefix use the option prefix.

### Single query
http://localhost:3000/ejs/index/db/stream - in the ejs-file use the data like <%= data => or <%= err =>

### Multiple queries
http://localhost:3000/ejs/index/api/select/list?nav=db,stream&user=db,get,key+person:AEYC8Y785  in the ejs-file use the data like <%= nav =>, <%= user => or your own keys.


```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost')

var EjsMiddleware = require('pusudb-use-ejs')
var ejsMiddlewareRender = new EjsMiddleware(__dirname + '/ejs', ['/static', /* blocked pathnames */], { prefix : '/ejs' }) 

//add the middleware to the pusudb
pusudb.use('http', ejsMiddlewareRender.serve)


pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```


### HTML Example
Filename: 'index.ejs'
URL: 'http://localhost:3000/ejs/index/db/stream'

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

