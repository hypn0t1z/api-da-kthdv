const { sequelize, Sequelize } = require('../');
const ActiveTokenModel = require('../models/active-token.model');
/**
* UserModel describes 'users' table
*/
const UserModel = sequelize.define(
    'Users',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        account_type: Sequelize.STRING,
        mail_token: Sequelize.STRING,
        forgot_token: Sequelize.STRING,
        status: {
            type: Sequelize.STRING,
            defaultValue: 'Inactive'
        },
        avatar: Sequelize.STRING,
        phone: Sequelize.STRING,
        province: Sequelize.INTEGER,
        ward: Sequelize.INTEGER,
        district: Sequelize.INTEGER,
        address_more: Sequelize.STRING,
        birthday: Sequelize.STRING,

        role_id: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'users',
    },
);

/**
* Describes users <=> active_token relationship
*/

module.exports = UserModel;
