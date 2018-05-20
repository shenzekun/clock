const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    ipcRenderer
} = require('electron')
const path = require('path')
const url = require('url')
const pkg = require('../../package.json')
const {
    setAppMenu,
    setDockMenu
} = require('./configs/menu')
const configuration = require('./configs/configuration');

let mainWindow = null
let settingWindow = null

// 菜单栏图标
let appIcon = null

function createMainWindow() {
    if (!configuration.readSettings('workTime') &&
        !configuration.readSettings('breakTime') &&
        !configuration.readSettings('voiceName')) {
        configuration.saveSettings('workTime', 1500);
        configuration.saveSettings('breakTime', 600);
        configuration.saveSettings('voiceName', 'digital')
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        titleBarStyle: "hiddenInset",
        resizable: false,
        backgroundColor: '#dfe7f1'
    })

    //判断是否是开发模式
    if (pkg.dev) {
        console.log('开发')
        mainWindow.loadURL("http://localhost:3000/")
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../../build/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // setAppMenu()
    setDockMenu()

    globalSetting();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        settingWindow = null
    })
    // ipcMain.on('put-in-tray', function (event) {
    // })
    //
    // const iconName = 'tray-icon.png'
    // const iconPath = path.join(__dirname, '../images/' + iconName)
    // appIcon = new Tray(iconPath)
    // const contextMenu = Menu.buildFromTemplate([{
    //     label: 'Quit',
    //     click: function (e) {
    //         app.quit();
    //     }
    // }])
    // appIcon.setToolTip('闹钟提醒')
    // appIcon.setContextMenu(contextMenu)
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (appIcon) appIcon.destroy()
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow()
    }
})

ipcMain.on('remove-tray', function () {
    appIcon.destroy()
})

ipcMain.on('close_main_window', function () {
    app.quit();
});

ipcMain.on('open_settings_window', function () {
    if (settingWindow) {
        return
    }
    settingWindow = new BrowserWindow({
        height: 300,
        width: 400,
        titleBarStyle: "hiddenInset",
        resizable: false,
        backgroundColor: '#dfe7f1'
    })

    //判断是否是开发模式
    if (pkg.dev) {
        settingWindow.loadURL("http://localhost:3000/#/setting")
        // Open the DevTools.
        settingWindow.webContents.openDevTools()
    } else {
        settingWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../../build/index.html'),
            protocol: 'file:',
            slashes: true,
            hash: '/setting'
        }));
    }

    settingWindow.on('closed', function () {
        settingWindow = null;
        mainWindow.reload()
    });
})

ipcMain.on('close_settings_window', function () {
    if (settingWindow) {
        settingWindow.close();
    }
})

function globalSetting() {
    const workTime = configuration.readSettings('workTime');
    const breakTime = configuration.readSettings('breakTime');
    const voiceName = configuration.readSettings('voiceName');
    mainWindow.webContents.send('setting_workTime', workTime);
    mainWindow.webContents.send('setting_breakTime', breakTime);
    mainWindow.webContents.send('setting_voiceName', voiceName)
}

ipcMain.on('global-setting', function () {
    globalSetting();
})