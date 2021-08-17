require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    welcome: {
        response: (userName) => `Welcome to the stream of salt ${userName}!`
    },
    seeUserOff: {
        response: (userName) => `${userName} has left the stream. Until next time!`
    },
    messageCommands: {
        echo: {
            response: (msg) => $(msg)
        }
    }
    /*
    website: {
      response: 'https://spacejelly.dev'
    },
    upvote: {
      response: (argument) => `Successfully upvoted ${argument}`
    }
    */
  }

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [ process.env.TWITCH_OWNER_USERNAME ]
});

client.connect();

client.on("join", (channel, username, self) => {
    const isBotOrOwner = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAM ||
                        tags.username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;

    if(isBotOrOwner) return;

    client.say(channel, commands[welcome(username)]);
});

client.on("part", (channel, username, self) => {
    const isBotOrOwner = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAM ||
                        tags.username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;

    if(isBotOrOwner) return;

    client.say(channel, commands[seeUserOff(username)]);
});

client.on('message', (channel, tags, message, self) => {
    const isBotOrOwner = tags.username.toLowerCase() === process.env.TWITCH_BOT_USERNAM ||
                        tags.username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;

    if(isBotOrOwner) return;

    const [raw, command, argument] = message.match(regexpCommand);

    const { response } = commands[command] || {};
    
    if ( typeof response === 'function' ) {
        client.say(channel, response(argument));
    } else if ( typeof response === 'string' ) {
        client.say(channel, response);
    }
    
});
		