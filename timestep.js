/*
MIT License

Copyright (c) 2018 Richard Slater

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const freqHz = 40;
const period = 1 / freqHz * 1e9;
var timeLast = process.hrtime();
var accumulator = 0;
var modules = [];

function justNanoseconds(hrt) {
    return hrt[0] * 1e9 + hrt[1];
}

function justMilliseconds(hrt) {
    return hrt[0] * 1e3 + hrt[1] / 1e6;
}

function justSeconds(hrt) {
    return hrt[0] + hrt[1] / 1e9;
}

var counter = [0, 0];
function debugLog1(dt) {
    counter[1] += dt;
    if (counter[1] >= 1e9) {
        counter[1] -= 1e9;
        counter[0] += 1;
    }
}

var timer = 0.0;
function debugLog2(dt) {
    timer += dt / 1e9;
    if (timer >= 1) {
        timer -= 1;
        console.log(`counter: ${counter[0] + counter[1] / 1e9}`);
    }
}

modules.push(debugLog1);
modules.push(debugLog2);

function pulse() {
    var timeNow = process.hrtime();
    var elapsed = [timeNow[0] - timeLast[0], timeNow[1] - timeLast[1]];
    timeLast = timeNow;
    accumulator += justNanoseconds(elapsed);
    if (accumulator >= period) {
        accumulator -= period;
        modules.forEach(function(m) { m(period); });
    }
    if (accumulator > period * 2) { accumulator = 0; }
    var sleepTime = (period - accumulator) / 1e6;
    setTimeout(pulse, sleepTime);
}

pulse();