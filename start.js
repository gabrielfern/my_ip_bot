const https = require('https'),
      fs = require('fs'),
      HttpBin = require('./httpbin'),
      info = JSON.parse(fs.readFileSync('personal_info.json').toString())

function getUpdates() {
    let body = {
            'timeout': 120
        },
        // fresh refer to whether we have here a new bot or not
        fresh = info.update_id == undefined || info.offset == undefined
    if (!fresh)
        body.offset = info.update_id + info.offset
    let stringifyed = JSON.stringify(body),
        options = {
            'hostname': 'api.telegram.org',
            'port': 443,
            'path': `/bot${info.token}/getUpdates`,
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringifyed)
            }
        },
        req = https.request(options)
    req.on('response', resp => {
        resp.on('data', data => {
            data = JSON.parse(data.toString())
            if (data.ok) {
                if (data.result.length > 0) {
                    if (fresh) {
                        info.update_id = data.result[0]
                        info.offset = 0
                    }
                    // set received messages as "read"
                    // since the offset function is to tell telegram bot api
                    // where to start of next update
                    info.offset += data.result.length
                    for (update of data.result) {
                        // log interesting things about the messages
                        console.log('=====')
                        console.log('update:', update.update_id)
                        console.log('username:', update.message.chat.username)
                        console.log('chat:', update.message.chat.id)
                        console.log('text:', update.message.text)
                        // if message was request for ip and from you
                        // send ip address
                        if (update.message.text == info.command)
                            if (update.message.chat.username == info.me)
                                sendIp(update.message.chat.id)
                            else
                                sendMessage(update.message.chat.id,
                                    `sorry, u're not @${info.me}`)
                        else
                            sendMessage(update.message.chat.id,
                                'sorry, not a ip request')
                    }
                    flushJSON('personal_info.json', info)
                }
            }
            // a trick to escape of recursion
            setImmediate(getUpdates)
        })
    })
    req.on('error', err => console.log(err))
    req.end(stringifyed)
}

function sendMessage(chatId, text) {
    let body = {
            'chat_id': chatId,
            'text': text
        },
        stringifyed = JSON.stringify(body),
        options = {
            'hostname': 'api.telegram.org',
            'port': 443,
            'path': `/bot${info.token}/sendMessage`,
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringifyed)
            }
        },
        req = https.request(options)
    req.on('response', resp => {
        resp.on('data', data => {
            // log to console if message was successful
            console.log('resp:', JSON.parse(data.toString()).ok)
        })
    })
    req.on('error', err => console.log(err))
    req.end(stringifyed)
}

function sendIp(chatId) {
    let hb = new HttpBin()
    hb.on('ip', ip => {
        sendMessage(chatId, ip)
    })
    hb.getIp()
}

function flushJSON(file, obj) {
    fs.writeFileSync(file, JSON.stringify(obj))
}

getUpdates()
