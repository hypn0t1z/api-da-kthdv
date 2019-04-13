module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('addresses', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        province: Sequelize.INTEGER,
        district: Sequelize.INTEGER,
        ward: Sequelize.INTEGER,
        address_more: Sequelize.STRING,
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('addresses'),
};