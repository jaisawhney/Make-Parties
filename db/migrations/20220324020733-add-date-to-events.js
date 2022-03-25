'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Events', 'takesPlaceOn', {type: Sequelize.DATE});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Events', 'takesPlaceOn');
  }
};
