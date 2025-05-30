import * as fs from 'fs';
import * as path from 'path';
import { utility } from './utility.js';

class _logger {

    private streamMessage: fs.WriteStream;
    private streamError: fs.WriteStream;
    private _console: Console;
    private flgErrorLogged = false;

    constructor() {
        if (fs.existsSync('./import-log.txt'))
            fs.rmSync('./import-log.txt');
        if (fs.existsSync('./error-log.txt'))
            fs.rmSync('./error-log.txt');

        this.streamMessage = fs.createWriteStream('./import-log.txt', { encoding: 'utf-8' });
        this.streamError = fs.createWriteStream('./error-log.txt', { encoding: 'utf-8' });
        this._console = new console.Console(this.streamMessage, this.streamError);
    }

    logMessage(message: string, ...params: any[]): void {
        console.log(message, ...params); //graphical console
        this._console.log(message, ...params); //file console
    }

    logError(fnInfo: string, err: any): void {
        if (!this.flgErrorLogged) {
            this.flgErrorLogged = true;
            let errorLog = '';
            if (!fnInfo.endsWith(')'))
                fnInfo += '()';
            errorLog += `Error from ${fnInfo} at ${utility.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\r\n`;
            if (typeof err == 'string')
                errorLog += err + '\r\n';
            else {
                let props = Object.getOwnPropertyNames(err);
                for (let i = 0; i < props.length; i++) {
                    let propName = props[i];
                    let propValue = err[propName];
                    if (typeof propValue == 'string')
                        errorLog += propValue + '\r\n';
                }
            }
            errorLog += '-'.repeat(80) + '\r\n\r\n\r\n';
            console.error(errorLog); //graphical console
            this._console.error(errorLog); //file console
        }
    }
}
let logger = new _logger();

export { logger };