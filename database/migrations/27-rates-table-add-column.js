module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'rates',
                'customer_id',
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'accounts',
                        key: 'id'
                    }, 
                }
            ),
            queryInterface.addColumn(
                'rates',
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