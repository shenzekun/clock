const {app, BrowserWindow, Tray, ipcMain, Menu} = require('electron')
const path = require('path')
const url = require('url')
const pkg = require('../../package.json')
const {setAppMenu, setDockMenu} = require('./configs/menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// 菜单栏图标
let appIcon = null

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, titleBarStyle: "hiddenInset"})
    //判断是否是开发模式
    if (pkg.dev) {
        win.loadURL("http://localhost:3000/")
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, './build/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Open the DevTools.
    win.webContents.openDevTools()

    // setAppMenu()
    setDockMenu()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
    // ipcMain.on('put-in-tray', function (event) {
    const iconName = 'tray-icon.png'
    const iconPath = path.join(__dirname, '../images/' + iconName)
    // console.log(iconPath)
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Remove',
        click: function () {
            // event.sender.send('tray-removed')
            console.log('ddddd')
        }
    }])
    appIcon.setToolTip('闹钟提醒')
    appIcon.setContextMenu(contextMenu)
// })
//
// ipcMain.on('remove-tray', function () {
//     appIcon.destroy()
// })

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
    if (win === null) {
        createWindow()
    }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

