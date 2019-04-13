module.exports = {
    up: (queryInterface, Sequelize) =>
    queryInterface.createTable('accounts', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        account_type: Sequelize.STRING,
        mail_token: Sequelize.STRING,
        forgot_token: Sequelize.STRING,
        phone: Sequelize.STRING,
        status: {
            type: Sequelize.STRING,
            defaultValue: 'Inactive'
        },
        role: Sequelize.INTEGER,
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('accounts'),
};