const { sequelize, Sequelize } = require('../');

/**
* ActiveTokenModel describes 'active_tokens' table
*/
const ActiveTokenModel = sequelize.define(
    'active_tokens',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: Sequelize.TEXT,
        lastseen: Sequelize.DATE,
        account_id: Sequelize.INTEGER,
        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'active_tokens',
    },
);

module.exports = ActiveTokenModel;