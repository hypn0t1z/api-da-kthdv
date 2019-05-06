const { sequelize, Sequelize } = require('../');
const ProfileModel = require('./12-profile.model');
const ProviderModel = require('./21-provider.model');

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
        province: Sequelize.STRING,
        district: Sequelize.STRING,
        ward: Sequelize.STRING,
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
AddressModel.hasOne(ProfileModel, { foreignKey: 'address_id' });
ProfileModel.belongsTo(AddressModel, { foreignKey: 'address_id' });

AddressModel.hasMany(ProviderModel, { foreignKey: 'address_id' });
ProviderModel.belongsTo(AddressModel, { foreignKey: 'address_id' });

module.exports = AddressModel;