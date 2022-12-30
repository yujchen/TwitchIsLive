async function foo(){
    const UsherService = require('./usher.js');
    let streamID = process.argv[2];
    if (streamID === null || streamID === undefined){
        console.log("Error: no stream name input");
        process.exit(1);
    }
    while(true){
        if (UsherService.isChannelLive(streamID) === 1){
            console.log(`${streamID} is online.`);
        }
        else if (UsherService.isChannelLive(streamID) === 0){
            console.log(`${streamID} is offline.`);
        }
        else if (UsherService.isChannelLive(streamID) === 2){
            console.log(`${streamID} does not exist.`);
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}
module.exports.foo = foo;