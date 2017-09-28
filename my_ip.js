const https = require('https'),
      fs = require('fs'),
      httpbin = new (require('./httpbin'))(),
      info = JSON.parse(fs.readFileSync('personal_info.json').toString()),
      url = `https://api.telegram.org/bot${info.token}/`

// https.get(url + 'getMe', resp => {
//    resp.on('data', data => {
//        console.log(JSON.parse(data.toString()))
//    })
// })

// https.get(url + 'getUpdates', resp => {
//    resp.on('data', data => {
//        let result = JSON.parse(data.toString())
//
//        console.log(result['result'][12])
//    })
// })

httpbin.on('ip', ip => {
    let body = {
            chat_id: info.chat_id,
            text: ip
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
})
httpbin.getIp()
