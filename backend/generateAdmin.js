const User = require('./models/User');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const email = 'admin@deliveryapp.com';
    const password = 'Admin@123'; // كلمة المرور المراد التأكد منها
    const role = 'admin';

    const existing = await User.findByEmail(email);

    if (existing) {
      // 🔹 تحقق إذا كانت كلمة المرور الحالية تطابق المطلوبة
      const match = await bcrypt.compare(password, existing.password_hash);

      if (!match) {
        // ❌ إذا لم تطابق، حدث كلمة المرور
        const hash = await bcrypt.hash(password, 10);
        await User.update(existing.id, { password_hash: hash });
        console.log('Admin existant mis à jour avec nouveau mot de passe');
      } else {
        console.log('Admin existant، كلمة المرور صحيحة بالفعل');
      }
    } else {
      // ❌ إذا لم يكن موجود، أنشئ admin جديد
      const hash = await bcrypt.hash(password, 10);
      const id = await User.create({
        email,
        password_hash: hash,
        role,
        nom: 'Admin',
        prenom: 'Super',
        telephone: '0600000000',
        photo: null
      });
      console.log(`Admin créé avec id: ${id}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();