const debug = require('debug');
const path = require('path');
const fs = require('fs');

const DEFAULT_TIMEOUT = 60000;
const DEFAULT_INTERVAL = 100;

const Watcher = (event,
    filepath, timeout, interval,
    check,
    resolve, reject) => {
    const log = debug(`waitfs:${event}:${path.basename(filepath)}`);
    let intervalId = undefined;
    let timeoutId = undefined;
    let status = false;
    // const log = () => console.debug(`wait:${event}:${path.basename(filepath)}`);

    const watcher = {
        check: () => {
            try {
                log('CHECK');
                status = check(filepath);
                if (status) {
                    watcher.stop();

                    resolve(true);
                } else {
                    watcher.wait();
                }
                return status;
            } catch (error) {
                reject(error);
            }
        },
        init: () => {
            log('INIT');
            if (!watcher.check())
                timeoutId = setTimeout(watcher.timeout, timeout);

        },
        wait: () => {
            log('WAIT');
            if (!status) intervalId = setTimeout(watcher.check, interval);
        },
        timeout: () => {
            log('TIMEOUT');

            watcher.stop();
            resolve(false);
        },
        stop: () => {
            log('STOP');

            if (intervalId !== undefined) {
                log('CLEAR INTERVAL');
                clearTimeout(intervalId);
            }
            if (timeoutId !== undefined) {
                log('CLEAR TIMEOUT');
                clearTimeout(timeoutId);
            }
        }
    };

    return watcher;
};

const wait = {};

wait.forCreate = (filepath, timeout = DEFAULT_TIMEOUT, interval = DEFAULT_INTERVAL) => new Promise((resolve, reject) => {
    const check = fs.existsSync.bind(fs);
    const watcher = Watcher('forCreate', filepath, timeout, interval, check, resolve, reject);

    watcher.init();
});
wait.forRemove = (filepath, timeout = DEFAULT_TIMEOUT, interval = DEFAULT_INTERVAL) => new Promise((resolve, reject) => {
    const check = f => !fs.existsSync(f);
    const watcher = Watcher('forRemove', filepath, timeout, interval, check, resolve, reject);

    watcher.init();
});

module.exports = wait;
module.exports.default = wait;
