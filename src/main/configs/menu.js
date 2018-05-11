const {app, Menu, BrowserView} = require('electron')

// 设置菜单
const menuTemplate = [
    {
        label: 'hhhh'
    }
]

// 设置 dock 菜单
const dockMenu = [{
    label: 'New Window',
    click() {
        console.log('New Window')
    }
}]

const setAppMenu = () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

const setDockMenu = () => {
    app.dock.setMenu(Menu.buildFromTemplate(dockMenu))
}

module.exports = {
    setAppMenu,
    setDockMenu
}
