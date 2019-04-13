module.exports = {
    up: function (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.addColumn(
			'users',
			'birthday', Sequelize.STRING
        ),
        queryInterface.addColumn(
			'users',
			'province', {
              type: Sequelize.INTEGER,
              defaultValue: 0
          },
        ),
        queryInterface.addColumn(
			'users',
			'district', {
              type: Sequelize.INTEGER,
              defaultValue: 0
          },
        ),
		queryInterface.addColumn(
			'users',
			'ward', {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
		),
		queryInterface.addColumn(
			'users',
			'address_more', Sequelize.STRING
		),
      ]);
    }, 
  };