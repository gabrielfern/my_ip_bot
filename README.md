Using the telegram bot api for retrieve your ip address, every time it
has changed, being able to know your external ip address through a simple
telegram chat (useful when you are out of pc/home if you have a dynamic ip)

# apis used here

[telegram bot api](https://core.telegram.org/bots/api)

[httpbin api](http://httpbin.org/)

# to get your external ip address

    node httpbin

# how to use

# 1.setup

    you need a telegram bot api token (which can be get with /newbot command
        to @BotFather)
    after that, just run

        node setup

# 2.start

    and every time you need your bot to be running (to reply messages)
    run

        node start
