// Electron wrapper — نسخه دسکتاپ ویندوز (اختیاری، بعد از npm install)
const { app, BrowserWindow } = require('electron');
const path = require('path');
function create() {
  const w = new BrowserWindow({
    width: 1280, height: 860, title: 'تبریک‌ساز SMH 🎉',
    backgroundColor: '#150b2e', autoHideMenuBar: true
  });
  w.loadFile(path.join(__dirname, '..', 'shared', 'index.html'));
}
app.whenReady().then(create);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
