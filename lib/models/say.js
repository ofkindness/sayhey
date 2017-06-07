const Sequelize = require('sequelize');

const sequelize = new Sequelize('sayhey',
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

sequelize.define('say', {
  userId: {
    type: Sequelize.STRING,
    primaryKey: true,
    field: 'userId'
  },
  userName: Sequelize.STRING,
  say: Sequelize.STRING
}, {
  tableName: 'say',
  timestamps: true
});

module.exports = sequelize;
