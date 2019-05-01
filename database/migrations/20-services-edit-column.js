module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'services',
                'provider_id', Sequelize.INTEGER
            ),
            queryInterface.addColumn(
                'services',
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