module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('profiles', {
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
        full_name: Sequelize.STRING,
        avatar: Sequelize.STRING,
        birthday: Sequelize.STRING,
        address_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'addresses',
                key: 'id'
            },
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('profiles'),
};