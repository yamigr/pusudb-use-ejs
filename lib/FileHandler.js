const findfile = require('findfile-in-folder-by-pathname')
const path = require('path')
const ejs = require('ejs')

class FileHandler {

    /**
     *
     * @param {string} base base path to the files
     * @param {array} escape which url should be escaped example the /db/put
     * @param {object} opt options to handle, see the ejs-doc
     */
    constructor(base, escape, opt){
        this.base = base ? base : './'
        this.escape = Array.isArray(escape) ? escape : []
        this.options = opt || {}
        this.serve = this.serve.bind(this)
        this.renderGlobalData = {}
        this.renderFileData = {}
    }

    /** 
     * Get the data
    */
    getRenderGlobalData(){
        return this.renderGlobalData
    }

    /**
     * Data to render in ejs-file
     * @param {object} data 
     */
    setRenderGlobalData(data){
        this.checkData(data)
        this.renderGlobalData = data
    }

    /**
     * Get the render data for files
     */
    getRenderFileData(){
        return this.renderFileData
    }

    /**
     * Data to render in ejs-file per file
     * @param {string} file filename with extensions
     * @param {object} data 
     */
    setRenderFileData(file, data){
        this.checkData(data)
        this.renderFileData[file] = data
    }

    /**
     * Check the given data for render
     * @param {object} data 
     */
    checkData(data){
        if(typeof data !== 'object') throw new Error('Data needs to be and object. Given data is typeof ' + typeof data)
        if(data.err || data.data || data.meta || data.db) throw new Error('Oooops... Properties err, meta, db and data are reserved.')
    }

    /**
     * Check if the middleware should serve a file or go to next with statuscode 404
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    serve(req, res, next){
        let self = this
 
        if(this.pathServe(req.url) && req.params.api.path){
            if(!this.checkPrefix(req)){
            res.statusCode = 404
            next()
            }
            else{
                try{
                this.fileHandler(req,res, function(){
                    next()
                })
                }
                catch(e){
                throw new Error(e)
                }
            }
        }
        else{
            next()
        }
    }

    /**
     * Normalize the path and get the file by pathname
     * @param {object} req 
     * @param {object} res 
     * @param {function} cb 
     */
    fileHandler(req, res, cb){
        let self = this

        // normalize the pathname
        let pathname = path.join(this.base, path.normalize(req.params.api.path).replace(/^(\.\.[\/\\])+/, ''))
        let ext = path.parse(pathname).ext
        let filename = req.params.api.path
        //when no filetype is given

        if(req.params.api.path !== '/' && !ext){
            pathname += '.ejs'
            filename += '.ejs'
        }

        //when client send a filetype html replace it with ejs
        else if(path.parse(pathname).ext === '.html'){
            pathname = pathname.replace('.html', '.ejs')
            filename = filename.replace('.html', '.ejs')
        }


        findfile.byPathname(this.base, pathname, { normalize : false, index : 'index.ejs' }, function(err, resolvedpathname, data){
            if(data){    

                // assign global data and file data if exis and the query-result to data
                ejs.renderFile(resolvedpathname, Object.assign(self.renderGlobalData, self.renderFileData[filename] || {}, req.docs), self.options, function(err, str){
                    if(err){
                    throw new Error(err)
                    }
                    else{
                    res.statusCode = 200
                    res.setHeader('Content-type',self.getMimeType( path.parse(resolvedpathname).ext ) || 'text/plain' )
                    res.write(str)
                    res.end()
                    cb(res.statusCode)
                    }
                })
            }
            else{
                cb()
            }
        })
    }

    /**
     * Check the pathname if the prefix exists in pathname and parse it by the prefix. 
     * @param {object} req 
     */
    checkPrefix(req){
        let check = true
        if( this.options.prefix && typeof this.options.prefix === 'string'){
            if(!req.params.api.path.startsWith(this.options.prefix))
                check = false
            else
                req.params.api.path =  req.params.api.path.replace( this.options.prefix + '/', '/')
            
            if(!req.params.api.path)
                req.params.api.path = '/'
        }
        return check
    }

    /**
     * Check if the pathname should be handlet or escaped
     * @param {object} url 
     */
    pathServe(url){
        for(let p in this.escape){
            if(url.startsWith(this.escape[p])){
                return false
            }
        }
        return true
    }

    getMimeType(type){
        let mimeType =  {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.ejs': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt'
        }

        return mimeType[ type ] || 'text/plain'

    }
}

module.exports = FileHandler