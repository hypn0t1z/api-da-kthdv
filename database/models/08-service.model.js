const { sequelize, Sequelize } = require('..');
const MidServiceModel = require('../models/13-mid-services.model');
const ServiceTypeModel = require('../models/07-service-type.model');
const TransactionModel = require('../models/09-transaction.model');
/**
* ServiceModel describes 'services' table
*/
const ServiceModel = sequelize.define(
    'services',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        provider_id: Sequelize.INTEGER,
        address_id: Sequelize.INTEGER,
        price_min: Sequelize.FLOAT,
        price_max: Sequelize.FLOAT,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'services',
    },
);

ServiceModel.hasMany(MidServiceModel, { foreignKey: 'service_id' });
MidServiceModel.belongsTo(ServiceModel, { foreignKey: 'service_id' });

ServiceModel.belongsToMany(ServiceTypeModel, { foreignKey: 'service_id', through: MidServiceModel });
ServiceTypeModel.belongsToMany(ServiceModel, { foreignKey: 'service_type_id', through: MidServiceModel });

ServiceModel.hasMany(TransactionModel, { foreignKey: 'service_id' });
TransactionModel.belongsTo(ServiceModel, { foreignKey: 'service_id' });

module.exports = ServiceModel;