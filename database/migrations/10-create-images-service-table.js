module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('images_service', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        provider_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'providers',
                key: 'id'
            },
        },
        path: Sequelize.STRING,
        description: Sequelize.STRING,
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('images_service'),
};