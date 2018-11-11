const findfile = require('findfile-in-folder-by-pathname')
const path = require('path')
const ejs = require('ejs')
var token = jwt.sign({ foo: 'bar' }, 'mysecret', { algorithm: 'RS256'});

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
        
        if(this.pathServe(req.url)){

            if(opt.prefix && typeof opt.prefix === 'string'){
                req.params.pathname =  req.params.pathname.replace(opt.prefix, '')
            }

            try{
                this.fileHandler(req,res, function(){
                    next()
                })
            }
            catch(e){
                next(e)
            }
        }
        else{
            next()
        }
    }

    fileHandler(req, res, cb){
        let self = this
        //check if it has crud parameters in pathname
        let handledpath = this.cutOffMetaInPath(req.meta, req.params.pathname)
        // normalize the pathname
        let pathname = path.join(this.base, path.normalize(handledpath).replace(/^(\.\.[\/\\])+/, ''));
        //render the file
        findfile.byPathname(this.base, pathname + '.ejs', { normalize : false }, function(err, resolvedpathname, data){
            if(data){
                if(path.parse(resolvedpathname).ext === '.ejs'){
                    ejs.renderFile(resolvedpathname, req.docs, self.options, function(err, str){
                        if(err){
                            throw new Error(err)
                        }
                        else{
                            res.setHeader('Content-type',self.getMimeType( path.parse(resolvedpathname).ext ) || 'text/plain' );
                            res.end(str);
                        }
                    });
                }
                else{
                    cb()
                }
            }
            else{
                if(self.options.multipath){
                    cb()
                    return;
                }
                else{
                    res.statusCode = 404;
                    res.end(`File ${resolvedpathname} not found!`);
                    return;
                }
            }
        })
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
            if(!meta[tmp[parseInt(index) + 1]]){
                str += tmp[index]
            }
            else{
                break;
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