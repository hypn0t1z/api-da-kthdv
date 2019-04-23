const { sequelize, Sequelize } = require('../');
const WardModel = require('./16-devvn_xaphuongthitran.model');

const DistrictModel = sequelize.define(
    'devvn_quanhuyen',
    {
        maqh: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        matp: Sequelize.STRING,

    },
    {   timestamps: false,
        tableName: 'devvn_quanhuyen',
    },
);
DistrictModel.hasMany( WardModel, { foreignKey: 'maqh' } );
WardModel.belongsTo( DistrictModel, { foreignKey: 'maqh' } );

module.exports = DistrictModel;