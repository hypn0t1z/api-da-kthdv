module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'services',
                'status_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'services',
                'status', Sequelize.INTEGER
            )
        ]);
    }, 
};