const { sequelize, Sequelize } = require('..');
const ServiceModel = require('./08-service.model');
const RateModel = require('./11-rate.model');
const TransactionModel = require('./09-transaction.model');
const ImgServiceModel = require('./10-images-service.model');

/**
* ProviderModel describes 'providers' table
*/
const ProviderModel = sequelize.define(
    'provider',
    {
        account_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        address_id: Sequelize.INTEGER,
        identity_card: Sequelize.STRING,
        status_id: Sequelize.INTEGER,
        open_time: Sequelize.STRING,
        close_time: Sequelize.STRING,
        latitude: Sequelize.FLOAT,
        longtitude: Sequelize.FLOAT,
        phone: Sequelize.STRING,
        name: Sequelize.STRING,
        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'provider',
    },
);

/**
* Describes providers relationship
*/
ProviderModel.hasMany(ServiceModel, { foreignKey: 'provider_id'});
ServiceModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(ImgServiceModel, { foreignKey: 'provider_id'});
ImgServiceModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(TransactionModel, { foreignKey: 'provider_id' });
TransactionModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(RateModel, { foreignKey: 'provider_id' });
RateModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

module.exports = ProviderModel;