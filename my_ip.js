const https = require('https'),
      http = require('http'),
      fs = require('fs'),
      HttpBin = require('./httpbin'),
      info = JSON.parse(fs.readFileSync('personal_info.json').toString())

function getUpdates() {
    let body = {
            offset: info.update_id + info.offset,
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
            data = JSON.parse(data.toString())
            if (data.ok) {
                info.offset += data.result.length
                for (update of data.result) {
                    console.log('=====')
                    console.log('update:', update.update_id)
                    console.log('username:', update.message.chat.username)
                    console.log('chat:', update.message.chat.id)
                    console.log('text:', update.message.text)
                    if (update.message.text == '/ip') {
                        if (update.message.chat.username == 'gabrielfernndss') {
                            sendIp(update.message.chat.id)
                        } else {
                            sendMessage(update.message.chat.id,
                                'sorry, u\'re not @gabrielfernndss')
                        }
                    } else {
                        sendMessage(update.message.chat.id,
                            'sorry, not a ip request')
                    }
                }
                flushJSON('personal_info.json', info)
            }
            getUpdates()
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
