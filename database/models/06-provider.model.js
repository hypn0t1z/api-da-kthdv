const { sequelize, Sequelize } = require('../');
const ServiceModel = require('./08-service.model');
const RateModel = require('./11-rate.model');
const TransactionModel = require('./09-transaction.model');
const ImgServiceModel = require('./10-images-service.model');
const AddressModel = require('./02-address.model');
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

ProviderModel.hasMany(TransactionModel, { foreignKey: 'provider_id' });
TransactionModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

ProviderModel.hasMany(RateModel, { foreignKey: 'provider_id' });
RateModel.belongsTo(ProviderModel, { foreignKey: 'provider_id' });

module.exports = ProviderModel;