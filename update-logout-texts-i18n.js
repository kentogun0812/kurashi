const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'jp'];

const dataToAdd = {
  nav: {
    loggingOut: { vi: "Đang đăng xuất...", en: "Logging out...", jp: "ログアウト中..." },
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.nav) data.nav = {};
    data.nav.loggingOut = dataToAdd.nav.loggingOut[loc];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
});
console.log('Nav translations updated with logout texts.');
