module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                'accounts',
                'role', Sequelize.INTEGER  
            ),
            queryInterface.addColumn(
                'accounts',
                'roles',
                {
                    type: Sequelize.ENUM,
                    values: ['0b001', '0b010', '0b011']
                }
            ),
        ]);
    }, 
};