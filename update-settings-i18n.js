const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'jp'];

const dataToAdd = {
  nav: {
    settings: { vi: "Cài đặt", en: "Settings", jp: "設定" }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.nav) data.nav = {};
    data.nav.settings = dataToAdd.nav.settings[loc];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
});
console.log('Nav translations updated with settings.');
