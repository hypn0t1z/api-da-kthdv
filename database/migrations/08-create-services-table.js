module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('services',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            provider_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'providers',
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
            price_min: Sequelize.FLOAT,
            price_max: Sequelize.FLOAT,

            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            }),
   
    down: (queryInterface, Sequelize) => queryInterface.dropTable('services'),
  }