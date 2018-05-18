const nconf = require('nconf')
const path = require('path')
const fs = require('fs')

nconf.argv().env().file({file: 'clock-config.json'})
// nconf.file({file: getUserHome() + '/clock-config.json'})

// function getUserHome() {
//     return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
// }

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};
