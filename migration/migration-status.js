const mongoose = require('mongoose');

require('../models/Game');

const Game = mongoose.model('Game');
const MONGO_URI = 'mongodb://localhost/project-kojima';

async function migrateStatusField() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Подключено к MongoDB');
  console.log('🚀 Начинаем миграцию поля status...');

  const res1 = await Game.updateMany(
    { completeFlag: true },
    { $set: { status: 'completed' } }
  );

  const res2 = await Game.updateMany(
    { completeFlag: { $in: [false, null] } },
    { $set: { status: 'playing' } }
  );

  console.log(`🔹 Обновлено документов с completed: ${res1.modifiedCount}`);
  console.log(`🔹 Обновлено документов с wishlist: ${res2.modifiedCount}`);

  // 4️⃣ Удаляем старое поле completeFlag
  // await Game.updateMany({}, { $unset: { completeFlag: "" } });

  console.log('✅ Миграция завершена!');

  await mongoose.disconnect();
  process.exit(0);
}

migrateStatusField().catch((err) => {
  console.error('❌ Ошибка миграции:', err);
  process.exit(1);
});
