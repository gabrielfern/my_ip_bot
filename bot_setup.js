const readline = require('readline'),
      rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
      })

rl.question('Provide your telegram bot api token\n--> ', resp => {
    rl.write('done\n')
    rl.close()
})
