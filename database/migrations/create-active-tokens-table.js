module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('active_tokens', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: Sequelize.INTEGER,
        token: Sequelize.TEXT,
        lastseen: Sequelize.DATE,
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('active_tokens'),
};