var fibonacciModule = require('bindings')('fibonacciModule');

async function middleware(req, res, next) {

    const args = argsPraser(req)

    let fibonacciNumber = null
    switch(true){
        case "get-next" in args:
            fibonacciNumber = fibonacciModule.Get()
        break
        case "reset" in args:
            fibonacciNumber = fibonacciModule.Reset()
        break  
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({fibonacci: fibonacciNumber}))
    res.end()
}

function argsPraser(req){
    let args = {}
    if(!req._parsedUrl.query)
        return {}
    req._parsedUrl.query.split("&").forEach(e=>{
        let kv = e.split("=")
        if(kv == 1)
            args[kv[0]] = kv[0]
        else
            args[kv[0]] = kv[1]
    })
    return args
}

module.exports = (req, res, next) => middleware(req, res, next)