const http = require('http'),
      Event = require('events')

class HttpBin extends Event {
    constructor() {
        super()
        this.url = 'http://httpbin.org/'
    }
    getIp() {
        http.get(this.url + 'ip', (res) => {
            res.on('data', (data) => {
                this.emit('ip', JSON.parse(data.toString()).origin)
            })
        })
    }
}

module.exports = HttpBin

if (require.main == module) {
    // example of how to use it
    let hb = new HttpBin()
    hb.on('ip', ip => console.log(ip))
    hb.getIp()
}
