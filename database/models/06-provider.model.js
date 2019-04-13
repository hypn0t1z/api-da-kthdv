const { sequelize, Sequelize } = require('../');
const AccountModel = require('../models/01-account.model');
const ServiceModel = require('../models/08-service.model');
const RateModel = require('../models/11-rate.model');
const TransactionModel = require('../models/09-transaction.model');
const ImgServiceModel = require('../models/10-images-service.model');
/**
* ProviderModel describes 'providers' table
*/
const ProviderModel = sequelize.define(
    'providers',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        account_id: Sequelize.INTEGER,
        address_id: Sequelize.INTEGER,
        identity_card: Sequelize.STRING,
        status_id: Sequelize.INTEGER,
        open_time: Sequelize.STRING,
        close_time: Sequelize.STRING,
        latitude: Sequelize.FLOAT,
        longtitude: Sequelize.FLOAT,
        phone: Sequelize.STRING,
        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'providers',
    },
);

/**
* Describes providers relationship
*/
ProviderModel.hasOne(AccountModel, { foreignKey: 'account_id' });
AccountModel.belongsTo(ProviderModel, { foreignKey: 'account_id' });

ProviderModel.hasOne(ServiceModel, { foreignKey: 'address_id' });
ServiceModel.belongsTo(ProviderModel, { foreignKey: 'address_id' });

ProviderModel.hasMany(TransactionModel, { foreignKey: 'provider_id' });
TransactionModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(RateModel, { foreignKey: 'provider_id' });
RateModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(ImgServiceModel, { foreignKey: 'provider_id' });
ImgServiceModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

module.exports = ProviderModel;