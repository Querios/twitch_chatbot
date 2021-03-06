require('dotenv').config();

const tmi = require('tmi.js');

const commands = {
    welcome: {
        response: (userName) => `Welcome to the stream of salt ${userName}!`
    },
    seeUserOff: {
        response: (userName) => `${userName} has left the stream. Until next time!`
    },
    messageCommands: {
        echo: {
            response: (msg) => `${msg}`
        },
        ban: {
            response: (channel, userName, reason) => client.ban(channel, userName, reason)
        },
        unban: {
            response: (channel, userName) => client.unban(channel, userName)
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
    const isBotOrOwner = username.toLowerCase() === process.env.TWITCH_BOT_USERNAME ||
                        username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;

    if(isBotOrOwner) return;

    client.say(channel, commands.welcome.response(username));
});

client.on("part", (channel, username, self) => {
    const isBotOrOwner = username.toLowerCase() === process.env.TWITCH_BOT_USERNAME ||
                        username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;

    if(isBotOrOwner) return;

    client.say(channel, commands.seeUserOff.response(username));
});

client.on('message', (channel, tags, message, self) => {
    if(!message.startsWith('!')) return;

    const isBotOrOwner = username.toLowerCase() === process.env.TWITCH_BOT_USERNAME ||
                        username.toLowerCase() === process.env.TWITCH_OWNER_USERNAME;
    
    const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

    const messageCommands = commands['messageCommands'];
    const { response } = messageCommands[command] || {};
    
    if(isBotOrOwner){
        if(command ==='ban') {
            response(channel, username, args.join(' '));
            return;
        }
        else if(command ==='unban') {
            response(channel, username);
            return;
        }       
    }
    
    
    if ( typeof response === 'function' ) {
        client.say(channel, response(args.join(' ')));
    }
    else if ( typeof response === 'string' ) {
        client.say(channel, response);
    }
    
});
		