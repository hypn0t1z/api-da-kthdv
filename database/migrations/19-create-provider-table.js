module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('provider',
        {
            account_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'accounts',
                    key: 'id'
                },
            },
            address_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'addresses',
                    key: 'id'
                },
            },
            identity_card: Sequelize.STRING,
            status_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'status',
                    key: 'id'
                },
            },
            name: Sequelize.STRING,
            open_time: Sequelize.STRING,
            close_time: Sequelize.STRING,
            latitude: Sequelize.FLOAT,
            longtitude: Sequelize.FLOAT,
            phone: Sequelize.STRING,

            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('provider'),
  };