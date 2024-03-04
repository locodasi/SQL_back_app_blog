const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('tokens', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: "users", key: "id"}
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('tokens')
    },
}