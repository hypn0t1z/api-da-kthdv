const { sequelize, Sequelize } = require('../');

const WardModel = sequelize.define(
    'devvn_xaphuongthitran',
    {
        xaid: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        maqh: Sequelize.STRING,
        name: Sequelize.STRING,
        type: Sequelize.STRING,

    },
    {
        timestamps: false,   
        tableName: 'devvn_xaphuongthitran',
    },
);
module.exports = WardModel;