const { sequelize, Sequelize } = require('../');

/**
* MidServiceModel describes 'mid_services' table
*/
const MidServiceModel = sequelize.define(
    'mid_services',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        service_id: Sequelize.INTEGER,
        service_type_id: Sequelize.INTEGER,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'mid_services',
    },
);

module.exports = MidServiceModel;