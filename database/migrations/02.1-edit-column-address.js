module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                'addresses',
                'province', Sequelize.STRING
            ),
            queryInterface.changeColumn(
                'addresses',
                'district', Sequelize.STRING
            ),
            queryInterface.changeColumn(
                'addresses',
                'ward', Sequelize.STRING
            ),
        ]);
    }, 
};