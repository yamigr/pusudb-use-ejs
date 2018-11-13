const findfile = require('findfile-in-folder-by-pathname')
const path = require('path')
const ejs = require('ejs')

class FileHandler {

    /**
     *
     * @param {string} base base path to the files
     * @param {array} escape which url should be escaped example the /db/put
     * @param {object} opt options to handle  { multipath : false }
     */
    constructor(base, escape, opt){
        this.base = base ? base : './'
        this.escape = Array.isArray(escape) ? escape : []
        this.options = typeof opt === 'object' ? opt : {}
        this.serve = this.serve.bind(this)
    }

    serve(req, res, next){
        let self = this
        
        if(this.pathServe(req.url) && req.pusudb.path){

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

    fileHandler(req, res, cb){
        let self = this
        //check if it has crud parameters in pathname
        let handledpath = req.pusudb.path
        // normalize the pathname
        let pathname = path.join(this.base, path.normalize(handledpath).replace(/^(\.\.[\/\\])+/, ''))
        //render the file

        if(!path.parse(pathname).ext){
            pathname += '.ejs'
        }

        findfile.byPathname(this.base, pathname, { normalize : false }, function(err, resolvedpathname, data){
            if(data){
                ejs.renderFile(resolvedpathname, req.docs, self.options, function(err, str){
                    if(err){
                        throw new Error(err)
                    }
                    else{
                        res.statusCode = 200
                        res.setHeader('Content-type',self.getMimeType( path.parse(resolvedpathname).ext ) || 'text/plain' )
                        req.content = str
                        cb()
                    }
                })
            }
            else{
                res.statusCode = 404
                cb()
            }
        })
    }

    checkPrefix(req){
        let check = true
        if( this.options.prefix && typeof this.options.prefix === 'string'){

            if(!req.pusudb.path.startsWith(this.options.prefix)){
                check = false
            }
            else{
                req.pusudb.path =  req.pusudb.path.replace( this.options.prefix, '')
            }
        }
        return check
    }
    /**
     * Check if the url has metas and cut them off to find the file
     * Meta-Object is defined by the tcpleveldb-client and is binded to the req.meta
     * @param {object} meta 
     * @param {string} url 
     */
    cutOffMetaInPath(meta, url){
        let tmp = url.split('/')
        let str = ''
        for(let index in tmp){

            //concat the splitted path until the next + 1 string is a meta action
            if(!meta[tmp[parseInt(index) + 1]]){
                str += tmp[index]
            }
            else{
                break
            }
        }
        return str
    }

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