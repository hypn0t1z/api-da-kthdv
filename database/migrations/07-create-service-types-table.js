module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('service_types',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: Sequelize.STRING,
            description: Sequelize.TEXT,

            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            }),
            
    down: (queryInterface, Sequelize) => queryInterface.dropTable('service_types'),
  }