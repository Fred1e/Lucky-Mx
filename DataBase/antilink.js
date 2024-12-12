const { Sequelize, DataTypes } = require('sequelize');
const config = require('../set');
const db = config.DATABASE;

const sequelize = new Sequelize(db, {
  dialect: 'postgres',
					ssl: true,
					protocol: 'postgres',
					dialectOptions: {
						native: true,
						ssl: { require: true, rejectUnauthorized: false },
					},
					logging: false,
});

const Antilink = sequelize.define('Antilink', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  mode: {
    type: DataTypes.STRING,
    defaultValue: 'non',
  },
  type: {
    type: DataTypes.ENUM('supp', 'warn', 'kick'),
    defaultValue: 'supp',
  },
}, {
  tableName: 'antilink',
  timestamps: false,
});

const Antilink_warnings = sequelize.define('Antilink_warnings', {
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'antilink_warnings',
  timestamps: false,
});

(async () => {
  await Antilink.sync();
  console.log("Table 'Antilink' synchronisée avec succès.");

  await Antilink_warnings.sync();
  console.log("Table 'Antilink_warnings' synchronisée avec succès.");
})();

module.exports = { Antilink, Antilink_warnings };
