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
Define the path where the ejs-files are located. Define some url's which should be escaped like the pure api-query. To define a url-prefix use the option prefix.

```js
var Pusudb = require('pusudb')
var pusudb = new Pusudb(3000, 'localhost', { log : true, prefix : '/api'})

var Render = require('pusudb-use-ejs')
var render = new Render(__dirname + '/ejs', ['/static', /* blocked pathnames */], { prefix : '/ejs' }) 

//add the middleware to the pusudb
pusudb.use('http', render.serve)

pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```

### Single query
* http://localhost:3000/ejs/index/api/db/stream
* <%= data => and <%= err => in ejs-file

### Multiple queries
* http://localhost:3000/ejs/index/api/select/list?nav=db,stream&user=db,get,key+person:AEYC8Y785 
* <%= nav => and <%= user => in ejs-file

### Add props in a middleware

Add some props to req.docs and use the data in the ejs-file.

```js
pusudb.useBefore('http', function(req, res, next){
    if(!req.url.startsWith('/api')){
        req.docs['lang'] = 'de'  // in ejs <%= lang %>
        req.docs['title'] = 'PUSUDB-STUDIO' // in ejs <%= title %>
        req.docs['scripts'] = [] // add some script paths and loop the array in ejs
        req.docs['styles'] = []
        req.docs['favicon'] = '/public/images/favicon.ico'  // in ejs <%= favicon %>
        next() 
    }
    else{
        next() 
    }
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

