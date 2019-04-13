const { sequelize, Sequelize } = require('../');
const AccountModel = require('../models/01-account.model');
const TransactionModel = require('../models/09-transaction.model');

/**
* CustomerModel describes 'customers' table
*/
const CustomerModel = sequelize.define(
    'customers',
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
        tableName: 'customers',
    },
);

CustomerModel.hasOne(AccountModel, { foreignKey: 'account_id' });
AccountModel.belongsTo(CustomerModel, { foreignKey: 'account_id' });

CustomerModel.hasMany(TransactionModel, { foreignKey: 'customer_id' });
TransactionModel.belongsTo(CustomerModel, { foreignKey: 'customer_id' });

module.exports = CustomerModel;