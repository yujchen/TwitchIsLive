let streamID = process.argv[2];
const UsherService = require('./usher.js');
const {Intents, Client} = require('discord.js');
const dstoken = require('dotenv');
dstoken.config();
let dsChannelID = process.env.YSTWITCHEVENT;

const dsclient = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

dsclient.on('ready',()=>{
    console.log("DSBot is ready");
    const channel = dsclient.channels.cache.get(dsChannelID);
    channel.send(`bark`);
    TwitchStatus(streamID);
});



dsclient.login(process.env.TOKEN);

async function TwitchStatus(streamID){
    let y = -1;
    let count = 0;
    if (streamID === null || streamID === undefined){
        console.log("Error: no stream name input");
        process.exit(1);
    }
    while(true){
        let status = UsherService.isChannelLive(streamID);
        console.log(`${getCurrentTime()} y is ${y}, Usher is ${status}`);
        if (y !== 1 && status === 1){
            if (UsherService.isChannelLive(streamID) == 1 && UsherService.isChannelLive(streamID) == 1){
                const channel = dsclient.channels.cache.get(dsChannelID);
                channel.send(`${streamID} is online.`);
                console.log(`${getCurrentTime()} ${streamID} is online.`);
                y = 1;
            }else{
                console.log(`Check failed. y is ${y} status ${status}`);
            }
        }
        else if (y !== 0 && status === 0){
            if (UsherService.isChannelLive(streamID) == 0 && UsherService.isChannelLive(streamID) == 0){
                const channel = dsclient.channels.cache.get(dsChannelID);
                channel.send(`${streamID} is offline.`);
                console.log(`${getCurrentTime()} ${streamID} is offline.`);
                y = 0;  
            }else{
                console.log(`Check failed. y is ${y} status ${status}`);
            }            
        }
        else if (y !== 2 && status === 2){
            if (UsherService.isChannelLive(streamID) == 2 && UsherService.isChannelLive(streamID) == 2){
                const channel = dsclient.channels.cache.get(dsChannelID);
                channel.send(`${streamID} does not exist.`);
                console.log(`${getCurrentTime()} ${streamID} does not exist.`);
                y = 2;
            }else{
                console.log(`Check failed. y is ${y} status ${status}`);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

function getCurrentTime(){
	let today = new Date(); 
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	let yyyy = today.getFullYear();
	let time = (today.getHours() < 10 ? '0'+today.getHours() : String(today.getHours())) + (today.getMinutes() < 10 ? '0'+today.getMinutes() : String(today.getMinutes()))  + (today.getSeconds() < 10 ? '0'+today.getSeconds() : String(today.getSeconds()));
	return '['+yyyy + '-' + mm + '-' + dd + '-' + time+']';
}
