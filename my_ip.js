const https = require('https'),
      fs = require('fs'),
      httpbin = new (require('./httpbin'))(),
      info = JSON.parse(fs.readFileSync('personal_info.json').toString()),
      url = `https://api.telegram.org/bot${info.token}/`

//https.get(url + 'getMe', resp => {
//    resp.on('data', data => {
//        console.log(JSON.parse(data.toString()))
//    })
//})

//https.get(url + 'getUpdates', resp => {
//    resp.on('data', data => {
//        let results = JSON.parse(data.toString()).result
//        console.log('Length: ' + results.length)
//        console.log(results[9])
//    })
//})

let body = {
        chat_id: `${some_chat}`,
        text: 'hello, what you want of me?'
    },
    stringifyed = JSON.stringify(body),
    options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${info.token}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(stringifyed)
        }
    },
    req = https.request(options, resp => {
        resp.on('data', data => console.log(data.toString()))
    })

req.end(stringifyed)
