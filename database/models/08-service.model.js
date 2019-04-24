const { sequelize, Sequelize } = require('..');
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

ServiceModel.hasOne(ServiceTypeModel, { foreignKey: 'service_type_id' });
ServiceTypeModel.belongsTo(ServiceModel, { foreignKey: 'service_type_id' });

ServiceModel.hasMany(TransactionModel, { foreignKey: 'service_id' });
TransactionModel.belongsTo(ServiceModel, { foreignKey: 'service_id' });

/* var UserProjects = sequelize.define('userprojects', {
    *   started: Sequelize.BOOLEAN
    * })
    * User.hasMany(Project, { through: UserProjects })
    * Project.hasMany(User, { through: UserProjects }) */

module.exports = ServiceModel;