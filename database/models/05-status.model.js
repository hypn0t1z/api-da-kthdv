const { sequelize, Sequelize } = require('../');
const ProviderModel = require('../models/06-provider.model');
/**
* StatusModel describes 'status' table
*/
const StatusModel = sequelize.define(
    'status',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        description: Sequelize.STRING,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'status',
    },
);

StatusModel.hasMany(ProviderModel, { foreignKey: 'status_id' });
ProviderModel.belongsTo(StatusModel, { foreignKey: 'status_id' });

module.exports = StatusModel;