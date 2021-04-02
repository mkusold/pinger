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

function log(data, ...more){
    console.log(`${new Date()}: ${data}`)
    if(more && more.length){
        console.log(more);
    }
}

async function checkSite(lookForError=true){
     
    try {
        const {status, data} = await axios.get(WEBSITE_URL);
        const isError = lookForError ? data.toLowerCase().includes(RESPONSE_MUST_NOT_CONTAIN) : false;
        if(status == 200 && !isError){
            log("This site is up and running!", data);
            return true;
        }
        else{
            log("This site might be down "+status);
            log(data);
            return false;
        }
    } catch(e){
        log(e);
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
        log(`Checking ${WEBSITE_URL}`);
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
            log('Currently dead');
        }
    }
}

function main(){
    pinger(alertSuccess, false);
}

main();