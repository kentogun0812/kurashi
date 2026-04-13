const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'jp'];

const newKeys = {
  profile: {
    title: { vi: "Thông tin cá nhân", en: "Personal Information", jp: "個人情報" },
    emailLabel: { vi: "Email (Không thể thay đổi)", en: "Email (Cannot be changed)", jp: "メールアドレス（変更不可）" },
    nameLabel: { vi: "Tên hiển thị (Nickname)", en: "Display Name (Nickname)", jp: "表示名（ニックネーム）" },
    namePlaceholder: { vi: "Nhập tên hiển thị của bạn", en: "Enter your display name", jp: "表示名を入力してください" },
    avatarTitle: { vi: "Ảnh đại diện", en: "Profile Picture", jp: "プロフィール画像" },
    avatarDesc: { vi: "Chọn một avatar ngẫu nhiên từ kho ảnh hệ thống, hoặc tải ảnh lên:", en: "Choose random avatar or upload:", jp: "システム画像を選ぶかアップロード：" },
    avatarUploadBtn: { vi: "Tải ảnh từ máy", en: "Upload from device", jp: "端末からアップロード" },
    securityTitle: { vi: "Bảo mật", en: "Security", jp: "セキュリティ" },
    securityDesc: { vi: "Để trống nếu bạn không muốn thay đổi mật khẩu.", en: "Leave blank to keep your current password.", jp: "パスワードを変更しない場合は空白に。" },
    pwdLabel: { vi: "Mật khẩu mới", en: "New Password", jp: "新しいパスワード" },
    pwdConfirmLabel: { vi: "Xác nhận mật khẩu mới", en: "Confirm Password", jp: "新しいパスワード（確認）" },
    saveBtn: { vi: "Lưu thay đổi", en: "Save Changes", jp: "変更を保存" },
    savingBtn: { vi: "Đang lưu...", en: "Saving...", jp: "保存中..." },
    updateSuccess: { vi: "Cập nhật thông tin thành công!", en: "Profile updated successfully!", jp: "プロフィールの更新に成功しました！" },
    pwdMismatch: { vi: "Mật khẩu mới không khớp.", en: "Passwords do not match.", jp: "パスワードが一致しません。" },
    uploadError: { vi: "Lỗi tải ảnh. Vui lòng thử lại.", en: "Upload failed. Try again.", jp: "アップロード失敗。再試行してください。" },
    systemError: { vi: "Lỗi hệ thống, vui lòng thử lại.", en: "System error, please try again.", jp: "システムエラー。再試行してください。" }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  if (!data.profile) data.profile = {};
  
  Object.keys(newKeys.profile).forEach(k => {
    data.profile[k] = newKeys.profile[k][loc];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Translations updated successfully.');
