// const nconf = require('nconf')
// const path = require('path')
// const fs = require('fs')
const store = require('./data');

function saveSettings(settingKey, settingValue) {
    // nconf.set(settingKey, settingValue);
    // nconf.save();
    store.set(settingKey, settingValue)
}

function readSettings(settingKey) {
    // nconf.load();
    return store.get(settingKey);
}

module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};