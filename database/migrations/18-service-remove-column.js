module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'services',
                'address_id', Sequelize.INTEGER
            )
        ]);
    }, 
};