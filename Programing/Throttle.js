
function throttle(func, delay) {
    let lastCall = 0;

    return function(...args){
        const now = new Date().getTime();
        if(now - lastCall < delay){
            return;
        }
        lastCall = now;
        func.apply(this, args);
    }
}

function sendChartMessage(message) {
    console.log(`Chart message: ${message}`);
}

const sendChartMessageWithSlowMode = throttle(sendChartMessage, 2*1000);

sendChartMessageWithSlowMode("Hello,");
sendChartMessageWithSlowMode("Hello, how are you?");
sendChartMessageWithSlowMode("Hello, how are you doing?");
sendChartMessageWithSlowMode("Hello, how are you doing today?");
