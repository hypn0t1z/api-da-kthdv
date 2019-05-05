const { sequelize, Sequelize } = require('../');
/**
* ProfileModel describes 'profiles' table
*/
const ProfileModel = sequelize.define(
    'profiles',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        account_id: Sequelize.INTEGER,
        full_name: Sequelize.STRING,
        avatar: Sequelize.STRING,
        birthday: Sequelize.STRING,
        address_id: Sequelize.INTEGER,
        status: Sequelize.STRING,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'profiles',
    },
);

module.exports = ProfileModel;