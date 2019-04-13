module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('transactions',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            service_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'services',
                    key: 'id'
                },
            },
            latitude: Sequelize.FLOAT,
            longtitude: Sequelize.FLOAT,

            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            }),
   
    down: (queryInterface, Sequelize) => queryInterface.dropTable('transactions'),
  }