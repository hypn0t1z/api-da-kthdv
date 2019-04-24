const { sequelize, Sequelize } = require('..');

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

module.exports = ServiceTypeModel;