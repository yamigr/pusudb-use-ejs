# pusudb-use-ejs

> Middleware to serve ejs view-engine files with the pusudb-framework.

Pusudb-filehandler to rendering [ ejs-files ]( https://ejs.co/).

Framework: [ pusudb ](https://www.npmjs.com/package/pusudb)

<a name="installing"></a>
## Installing

```sh
npm install pusudb-use-ejs --save
```

## Use
Define the path where the ejs-files are located. Define some url's which should be escaped like the pure api-query. To define a url-prefix use the option prefix.

```js
const Pusudb = require('pusudb')
const pusudb = new Pusudb(3000, 'localhost', { log : true, prefix : '/api'})

const Render = require('pusudb-use-ejs')
const render = new Render(__dirname + '/ejs', ['/public', '/api'/*, blocked pathnames */], { prefix : '/ejs' /*, ejs-options, see ejs-docs */ }) 

//add the middleware to the pusudb
pusudb.use('http', render.serve)

pusudb.listen(function(port, host){
    console.log('pusudb listening:', port, host)
})
```

### Single query and use data in ejs
* http://localhost:3000/ejs/index/api/db/stream
* <%= data => and <%= err => in ejs-file

### Multiple queries and use data in ejs
* http://localhost:3000/ejs/index/api/select/list?nav=db,stream&user=db,get,key+person:AEYC8Y785 
* <%= nav => and <%= user => in ejs-file

### Add render-data in instance
Reserved props are err, db, meta and data. Use the props in ejs-file like <%= title %>.

```js
// Set global data for any
render.setRenderGlobalData({ title : 'Page-Title', description : '42.'})
console.log( render.getRenderGlobalData() )

// Set data per file
render.setRenderFileData('index.ejs', { content : 'Some content', page : 'Index'})
render.setRenderFileData('contact.ejs', { address : '...', phone : '....'})
console.log( render.getRenderFileData() )

```

### Add render-data in a pusudb-middleware
Add some props to req.docs and use the data in the ejs-file.

```js
pusudb.useBefore('http', function(req, res, next){
    if(!req.url.startsWith('/api')){
        req.render['ticker'] = 'You can now use <%= ticker %> in the ejs-file'
        req.render['lang'] = 'de'  // in ejs <%= lang %>
        req.render['title'] = 'PUSUDB-STUDIO' // in ejs <%= title %>
        req.render['scripts'] = [] // add some script paths and loop the array in ejs
        req.render['styles'] = []
        req.render['favicon'] = '/public/images/favicon.ico'  // in ejs <%= favicon %>
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

