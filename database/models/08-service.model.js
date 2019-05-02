const { sequelize, Sequelize } = require('../');
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
        price_min: Sequelize.FLOAT,
        price_max: Sequelize.FLOAT,
        service_type_id: Sequelize.INTEGER,
        description: Sequelize.TEXT,

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

ServiceTypeModel.hasOne(ServiceModel, { foreignKey: 'service_type_id' });
ServiceModel.belongsTo(ServiceTypeModel, { foreignKey: 'service_type_id' });

ServiceModel.hasMany(TransactionModel, { foreignKey: 'service_id' });
TransactionModel.belongsTo(ServiceModel, { foreignKey: 'service_id' });

module.exports = ServiceModel;