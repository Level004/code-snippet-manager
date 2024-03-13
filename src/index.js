const { app, BrowserWindow, screen, ipcMain, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: width,
        minWidth: 1150,
        height: height,
        minHeight: 740,
        icon: path.join(__dirname, 'img/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: true, 
            nodeIntegrationInWorker: true, 
        },
    });


    mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('clipboardWriteText', (event, text) => {
    clipboard.writeText(text);
});

