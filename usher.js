//return 0 for offline, 1 for online, 2 for channel doesn't exit
function isChannelLive(channelName){
    const exec = require('child_process').execSync;
    let command1 = 'curl -s '; 
    let formatURL = (CN) => `'https://gql.twitch.tv/gql' -X POST -H 'Client-ID: kimne78kx3ncx6brgo4mv6wki5h1ko' --data-raw '{"operationName":"PlaybackAccessToken","query":"query PlaybackAccessToken($login: String!, $isLive: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: \\"web\\", playerBackend: \\"mediaplayer\\", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }}","variables":{"isLive":true,"login":"${CN}","playerType":"site"}}'`;
    
    let magicLink1 = formatURL(channelName);
    let formatURL2 = (channelName, sig, token) => `'https://usher.ttvnw.net/api/channel/hls/${channelName}.m3u8?player=twitchweb&p=123456&type=any&allow_source=true&allow_audio_only=true&allow_spectre=false&sig=${sig}&token=${token}&fast_bread=True'`;
    let liveStatus;
    let stdout = exec(command1+magicLink1).toString();
    let result = JSON.parse(stdout);
    if (result.data.streamPlaybackAccessToken === null ){
        return 2;
    }
    let token = encodeURIComponent(result.data.streamPlaybackAccessToken.value);
    let sig = result.data.streamPlaybackAccessToken.signature;
    let magicLink2 = formatURL2(channelName,sig,token);
    let stdout1 =    exec(command1+magicLink2).toString();
    if (stdout1.includes("transcode_does_not_exist")){
        return 0;
    }
    else if (stdout1.includes('#EXTM3U')){
        return 1;
    }
    else{
        return 0;
    }
};

module.exports.isChannelLive = isChannelLive;
