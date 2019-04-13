const { sequelize, Sequelize } = require('../');
const ProfileModel = require('../models/12-profile.model');
const ProviderModel = require('../models/06-provider.model');

/**
* AddressModel describes 'Address' table
*/
const AddressModel = sequelize.define(
    'addresses',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        province: Sequelize.INTEGER,
        district: Sequelize.INTEGER,
        ward: Sequelize.INTEGER,
        address_more: Sequelize.STRING,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'addresses',
    },
);

/**
* Describes accounts <=> Address relationship
*/
AddressModel.hasMany(ProfileModel, { foreignKey: 'address_id' });
ProfileModel.belongsTo(AddressModel, { foreignKey: 'address_id' });

AddressModel.hasMany(ProviderModel, { foreignKey: 'address_id' });
ProviderModel.belongsTo(ProviderModel, { foreignKey: 'address_id' });

module.exports = AddressModel;