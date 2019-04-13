const { sequelize, Sequelize } = require('../');

/**
* RateModel describes 'rates' table
*/
const RateModel = sequelize.define(
    'rates',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        account_id: Sequelize.INTEGER,
        provider_id: Sequelize.INTEGER,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'rates',
    },
);

module.exports = RateModel;