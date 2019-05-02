module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'notes', Sequelize.TEXT
            ),
            queryInterface.removeColumn(
                'providers',
                'status_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'providers',
                'status', Sequelize.STRING
            )
        ]);
    }, 
};