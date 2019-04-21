module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'profiles',
                'status', Sequelize.STRING
            )
        ]);
    }, 
};