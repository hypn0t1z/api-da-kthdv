module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'notes', Sequelize.TEXT
            ),
            queryInterface.removeColumn(
                'services',
                'status_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'services',
                'status', Sequelize.STRING
            )
        ]);
    }, 
};