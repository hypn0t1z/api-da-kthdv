module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                'transactions',
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