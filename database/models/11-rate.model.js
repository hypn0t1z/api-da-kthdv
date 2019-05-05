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
        customer_id: Sequelize.INTEGER,
        provider_id: Sequelize.INTEGER,
        star_number: Sequelize.INTEGER,
        comment: Sequelize.STRING,

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