module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'active_tokens',
                'account_id', 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'accounts',
                        key: 'id'
                    },
                }
            ),
            queryInterface.removeColumn(
                'active_tokens',
                'user_id'
            )
        ]);
    }, 
};