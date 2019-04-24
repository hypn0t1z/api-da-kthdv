module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'services',
                'service_type_id',
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'service_types',
                        key: 'id'
                    },
                }
            )
        ]);
    }, 
};