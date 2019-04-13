const { sequelize, Sequelize } = require('../');
/**
* RoleModel describes 'roles' table
*/
const RoleModel = sequelize.define(
    'roles',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        roles: Sequelize.STRING,
        description: Sequelize.STRING,

        //Timestamp
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    {   
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timestamps: true,
        tableName: 'roles',
    },
);

module.exports = RoleModel;
