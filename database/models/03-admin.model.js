const { sequelize, Sequelize } = require('../');
const AccountModel = require('../models/01-account.model');
/**
* AdminModel describes 'admin' table
*/
const AdminModel = sequelize.define(
    'admin',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        account_id: Sequelize.INTEGER,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'admin',
    },
);

/**
* Describes accounts <=> admin relationship
*/
AdminModel.hasOne(AccountModel, { foreignKey: 'account_id' });
AccountModel.belongsTo(AdminModel, { foreignKey: 'account_id' });

module.exports = AdminModel;