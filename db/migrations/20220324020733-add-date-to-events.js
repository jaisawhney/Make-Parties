'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Events', 'takesPlaceOn', {type: Sequelize.DATEONLY});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Events', 'takesPlaceOn');
  }
};
