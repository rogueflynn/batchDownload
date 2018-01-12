"use strict";
const Path = require("path");
const fs = require("fs");
const util = require("util");
const wget = require('wget-improved');
const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const dirPath = Path.join(__dirname, "/tmp");
const queue = [];

//query.push("<URL>");  //enqueue urls somehow (web scraping or pattern recognition)
//query.push("<URL>");  //enqueue element

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
        let src = "<URL>";
        let output = dirPath + "/<Name OF File>";
        let options = {};
        let download = wget.download(src, output, options);

        download.on('error', (err) => {
            reject(err) 
        });
        download.on('start', (filesize) => {
            console.log("File Size: " + filesize);
        });
        download.on('end', (output) => {
            resolve("completed downloaded"); 
        });
        download.on('progress', (progress) => {
            // code to show progress bar 
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