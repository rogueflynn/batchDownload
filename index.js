"use strict";
const Path = require("path");
const fs = require("fs");
const util = require("util");
const wget = require('wget-improved');
const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const dirPath = Path.join(__dirname, "/tmp");
const eventEmitter = require("events").EventEmitter;
const emitter = new eventEmitter();
const queue = [];
let url = "";
let ep = "";
let index = 0;

for(let i = 1; i < 49; i++) {
    /*
    //If link has 0 based numbering
    if(i < 10) {
        ep = "0" + i;
    } else {
        ep = i;
    }
    */
    ep = i;
    url = `<URL> + ${ep}`;
    queue.push(url);
}


const pathError = async () => {
    try {
        const noPath = await stat(dirPath);
        return noPath;
    } catch(err) {
        return err;
    }
};

const createDirectory = async () => {
    try {
        const newDirectory = await mkdir(dirPath);
        return newDirectory;
    } catch(err) {
        return err;
    }
};

const nodeWget = () => {
    return new Promise((resolve, reject) =>
    {
        console.log("Queue Count: " + queue.length);
        index++;
        let src = queue.shift();
        let fileName = "/<filename>" + index + ".<extension>";
        let output = dirPath + fileName;
        let options = {};
        let download = wget.download(src, output, options);
        let prevPercent;

        console.log("Downloading: "  + fileName);

        download.on('error', (err) => {
            reject(err) 
        });

        download.on('start', (filesize) => {
            console.log("File Size: " + filesize);
        });

        download.on('end', (output) => {
            console.log(fileName + " finished downloading");
            resolve("completed downloaded"); 
            emitter.emit("completed");
        });
        download.on("progress", (progress) => {
            let percent = Math.round(progress * 100);
            if(percent % 20 === 0 && percent !== prevPercent) {
                prevPercent = percent;
                console.log("File " + fileName + " is " + percent + "% completed.");
            }
        });
    });
};

const DownloadFiles = async() => {
    try {
        const result = await nodeWget();
        console.log(result);
    } catch(err) {
        console.log(err);
    }
};

if(pathError())  {
   createDirectory();
}

DownloadFiles();

emitter.on("completed", () => {
    if(queue.length !== 0) {
        console.log("Downloading another file");
        DownloadFiles();
    } else {
        console.log("completed download");
    }
});

