// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Expose 'fs', 'path', and 'clipboardWriteText' to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    fs: fs,
    path: path,
    clipboardWriteText: (text) => {
        ipcRenderer.send('clipboardWriteText', text);
    },
});

