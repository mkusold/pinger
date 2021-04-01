import axios from 'axios';
import ping from 'ping';
import playSound from 'play-sound';

const WEBSITE_URL =  'https://www.google.com/';
const SUCCESS_SOUND = '/System/Library/Sounds/Glass.aiff'
const RESPONSE_MUST_NOT_CONTAIN = 'error';

function alertSuccess(){    
    const player = playSound();
    player.play(SUCCESS_SOUND, function(err){
        if (err) throw err
      })
}

async function checkSite(lookForError=true){
     const {status, data} = await axios.get(WEBSITE_URL);
     const isError = lookForError ? data.toLowerCase().includes(RESPONSE_MUST_NOT_CONTAIN) : false;
     if(status == 200 && !isError){
        console.log("This site is up and running!", data);
        return true;
    }
    else{
        console.log("This site might be down "+status);
        console.log(data);
        return false;
    }
}

async function pinger(onSuccess, checkContent=false, timeoutSeconds=3){
    var cfg = {
        timeout: timeoutSeconds,
        // WARNING: -i 2 may not work in other platform like windows
        extra: ['-i', '2'],
    };

    let success = false;

    while(!success){
        console.log(`Checking ${WEBSITE_URL}`);
        const isAlive = await ping.promise.probe(WEBSITE_URL, cfg);
        if(isAlive){
            // after we ping, go a step further to look into the response codes and content
            const isGood = await checkSite(checkContent);
            if(isGood){
                success = isGood;
                console.log('Website is up!');
                onSuccess();
            }
        } else {
            console.log('Currently dead');
        }
    }
}

function main(){
    pinger(alertSuccess, false);
}

main();