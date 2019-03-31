module.exports = {
    up: function (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'phone', Sequelize.STRING
        ),
        queryInterface.addColumn(
            'users',
            'role_id', {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
        )
      ]);
    }, 
  };