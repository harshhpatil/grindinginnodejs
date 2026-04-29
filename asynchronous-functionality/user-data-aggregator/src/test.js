// Testing promises returns
const RESOLVE_TIMOUT = 1100; 
const REJECT_TIMEOUT = 1000; 

function PromiseTest() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise resolved successfully after " + RESOLVE_TIMOUT + " milliseconds.");
        }, RESOLVE_TIMOUT);
        setTimeout(() => {
            reject("Promise rejected after " + REJECT_TIMEOUT + " milliseconds.");
        }, REJECT_TIMEOUT);
    });
}

PromiseTest().catch(err => {
    console.error(err);
})