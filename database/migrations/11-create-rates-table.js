module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('rates', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customer_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'customers',
                key: 'id'
            },
        },
        provider_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'providers',
                key: 'id'
            },
        },
        star_number: Sequelize.INTEGER,
        comment: Sequelize.TEXT,
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('rates'),
};