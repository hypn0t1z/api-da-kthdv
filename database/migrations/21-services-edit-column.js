module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'services',
                'account_id', Sequelize.INTEGER,
            ),
            queryInterface.addColumn(
                'services',
                'provider_id',
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'provider',
                        key: 'account_id'
                    }, 
                }
            ),
        ]);
    }, 
};