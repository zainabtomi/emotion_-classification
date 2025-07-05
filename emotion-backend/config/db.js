// config/db.js
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // أو true لو حابب تشوف الاستعلامات
});
sequelize.sync();
module.exports = sequelize;
