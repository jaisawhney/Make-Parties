'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Rsvps',
            'EventId',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Events',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        );
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.removeColumn('Rsvps', 'EventId');
    }
};
