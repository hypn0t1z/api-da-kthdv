module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('status', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        description: Sequelize.STRING,
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('status'),
};