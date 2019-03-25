const { sequelize, Sequelize } = require('..');
const UserModel = require('./user.model');

/**
* ActiveTokenModel describes 'active_tokens' table
*/
const ActiveTokenModel = sequelize.define(
    'ActiveTokens',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: Sequelize.INTEGER,
        token: Sequelize.TEXT,
        lastseen: Sequelize.DATE,
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