module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'rates',
                'customer_id', Sequelize.INTEGER
            ),
            queryInterface.removeColumn(
                'rates',
                'provider_id', Sequelize.INTEGER
            ),
        ]);
    }, 
};