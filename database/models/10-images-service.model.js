const { sequelize, Sequelize } = require('..');

/**
* ImgServiceModel describes 'images_service' table
*/
const ImgServiceModel = sequelize.define(
    'images_service',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        provider_id: Sequelize.INTEGER,
        path: Sequelize.STRING,
        description: Sequelize.STRING,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'images_service',
    },
);

module.exports = ImgServiceModel;