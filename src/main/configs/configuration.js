
const nconf = require('nconf')

nconf.file({file: getUserHome() + '/clock-config.json'})


function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

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
