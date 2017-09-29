const https = require('https'),
      http = require('http'),
      fs = require('fs'),
      httpbin = new (require('./httpbin'))(),
      info = JSON.parse(fs.readFileSync('personal_info.json').toString()),
      url = `https://api.telegram.org/bot${info.token}/`

function getUpdates(offset) {
    if (offset == undefined)
        offset = info.offset
    let body = {
            offset: info.update_id + offset,
            timeout: 120
        },
        stringifyed = JSON.stringify(body),
        options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${info.token}/getUpdates`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringifyed)
            }
        },
        req = https.request(options)
    req.on('response', resp => {
        resp.on('data', data => {
            console.log(JSON.parse(data.toString()))
        })
    })
    req.on('error', err => console.log(err))
    req.end(stringifyed)
}

function sendMessage(chatId, text) {
    let body = {
            "chat_id": chatId,
            "text": text
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
        req = https.request(options)
    req.on('response', resp => {
        resp.on('data', data => {
            console.log(JSON.parse(data.toString()).ok)
        })
    })
    req.on('error', err => console.log(err))
    req.end(stringifyed)
}

httpbin.on('ip', ip => {
    sendMessage(info.chat_id, ip)
})
httpbin.getIp()

// getUpdates()
