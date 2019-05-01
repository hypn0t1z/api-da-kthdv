module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'images_service',
                'provider_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'images_service',
                'account_id',
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'accounts',
                        key: 'id'
                    }, 
                }
            ),
        ]);
    }, 
};