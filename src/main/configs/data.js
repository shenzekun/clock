const u = require('./utils');
const fs = require('fs');
const electron = require('electron');
const file = (electron.app || electron.remote.app).getPath('userData') + '/config.json';
var config = {};

var readConfig = () => {
    if (!u.exists(file)) {
        fs.writeFileSync(file, '{}');
    }
    config = JSON.parse(fs.readFileSync(file));
    console.log(config)
};

exports.set = function (key, value) {
    u.set(config, key)(value);
    u.sync(file, config);
};

exports.get = function (key, defaultValue) {
    readConfig()
    const value = u.search(config, key);
    return value === undefined ? defaultValue : value;
};