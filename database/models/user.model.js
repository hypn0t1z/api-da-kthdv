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
UserModel.hasOne(ActiveTokenModel, { foreignKey: 'user_id' });
ActiveTokenModel.belongsTo(UserModel, { foreignKey: 'user_id' });

module.exports = UserModel;
