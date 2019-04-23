const { sequelize, Sequelize } = require('../');
const DistrictModel = require('./14-devvn_quanhuyen.model');
const ProvinceModel = sequelize.define(
    'devvn_tinhthanhpho',
    {
        matp: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        type: Sequelize.STRING,

    },
    {   
        timestamps: false,
        tableName: 'devvn_tinhthanhpho' 
    },
);

ProvinceModel.hasMany( DistrictModel, { foreignKey: 'matp'} );
DistrictModel.belongsTo( ProvinceModel, { foreignKey: 'matp' } );

module.exports = ProvinceModel;