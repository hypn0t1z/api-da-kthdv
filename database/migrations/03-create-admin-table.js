module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('admin', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        account_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'accounts',
                key: 'id'
            },
        },
       
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('admin'),
};