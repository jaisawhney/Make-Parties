'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Rsvps',
        'UserId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
    );
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Events', 'UserId');
  }
};
