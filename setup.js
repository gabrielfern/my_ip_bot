const fs = require('fs'),
      readline = require('readline'),
      rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
      })

rl.question('Provide your telegram bot api token\n--> ',
token => {
    rl.question('your personal telegram username(without @)\n--> ',
    username => {
        rl.question('your message to make the bot send back the ip\n--> ',
        message => {
            let info = {
                'token': token,
                'me': username,
                'command': message
            }
            rl.write('personal info saved to personal_info.json\n')
            rl.write(JSON.stringify(info) + '\n')
            rl.write('you can now run start to init the bot\n')
            rl.close()
        })
    })
})
