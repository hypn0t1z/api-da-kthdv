const { sequelize, Sequelize } = require('..');

/**
* TransactionModel describes 'transactions' table
*/
const TransactionModel = sequelize.define(
    'transactions',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: Sequelize.INTEGER,
        provider_id: Sequelize.INTEGER,
        service_id: Sequelize.INTEGER,
        latitude: Sequelize.FLOAT,
        longtitude: Sequelize.FLOAT,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'transactions',
    },
);

module.exports = TransactionModel;