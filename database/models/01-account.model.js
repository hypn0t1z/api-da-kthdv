const { sequelize, Sequelize } = require('../');
const ProfileModel = require('../models/12-profile.model');
const RateModel = require('../models/11-rate.model');
const ActiveToken = require('../models/active-token.model')

/**
* AccountModel describes 'accounts' table
*/
const AccountModel = sequelize.define(
    'accounts',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        account_type: Sequelize.STRING,
        mail_token: Sequelize.STRING,
        forgot_token: Sequelize.STRING,
        phone: Sequelize.STRING,
        status: {
            type: Sequelize.STRING,
            defaultValue: 'Inactive'
        },
        role: {
            type: Sequelize.INTEGER,
            defaultValue: 0b001
        },

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'accounts',
    },
);

AccountModel.hasOne(ProfileModel, { foreignKey: 'account_id' });
ProfileModel.belongsTo(AccountModel, { foreignKey: 'account_id' });

AccountModel.hasMany(RateModel, { foreignKey: 'account_id' });
RateModel.belongsTo(AccountModel, { foreignKey: 'account_id' });

AccountModel.hasOne(ActiveToken, {foreignKey: 'account_id'})
ActiveToken.belongsTo(AccountModel, {foreignKey: 'account_id'})

module.exports = AccountModel;