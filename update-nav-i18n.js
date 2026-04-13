const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'jp'];

const dataToAdd = {
  nav: {
    profile: { vi: "Hồ sơ cá nhân", en: "My Profile", jp: "プロフィール" }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.nav) data.nav = {};
    data.nav.profile = dataToAdd.nav.profile[loc];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
});
console.log('Nav translations updated.');
