module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'notes', Sequelize.TEXT
            ),
            queryInterface.removeColumn(
                'provider',
                'status_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'provider',
                'status', Sequelize.STRING
            )
        ]);
    }, 
};