const { sequelize, Sequelize } = require('..');
const MidServiceModel = require('../models/13-mid-services.model');

/**
* ServiceTypeModel describes 'service_types' table
*/
const ServiceTypeModel = sequelize.define(
    'service_types',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.STRING,
        description: Sequelize.TEXT,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'service_types',
    },
);

ServiceTypeModel.hasMany(MidServiceModel, { foreignKey: 'service_type_id' });
MidServiceModel.belongsTo(ServiceTypeModel, { foreignKey: 'service_type_id' });

module.exports = ServiceTypeModel;