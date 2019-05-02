module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'notes', Sequelize.TEXT
            )
        ]);
    }, 
};