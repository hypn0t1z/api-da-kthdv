module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mid_services', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        service_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'services',
                key: 'id'
            },
        },
        service_type_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'service_types',
                key: 'id'
            },
        },
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('mid_services'),
};