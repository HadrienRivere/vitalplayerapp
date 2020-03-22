'use strict'

const { ipcRenderer } = require('electron')
document.querySelector('.submit').addEventListener('click', function () {
  const email = document.querySelector("#email").value;
  const pass = document.querySelector('#password').value;
  const object = { email, pass };

  // send username to main.js 
  ipcRenderer.send('asynchronous-message', object);
  // receive message from main.js
  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const message = document.querySelector('.result');
    message.innerHTML += `${arg}`;
  })
});
// ========== [ Update ] ========== //
const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version');
  version.innerText = 'Version ' + arg.version;
});

ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'A new update is available. Downloading now...';
  notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});

function closeNotification() {
  notification.classList.add('hidden');
}

function restartApp() {
  ipcRenderer.send('restart_app');
}