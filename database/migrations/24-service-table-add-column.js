module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'description', Sequelize.TEXT
            ),
            queryInterface.removeColumn(
                'service_types',
                'description', Sequelize.TEXT
            ),
        ]);
    }, 
};