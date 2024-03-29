const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('readinglists', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key:"id" }
            },
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "blogs", key:"id" }
            },
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                //defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                //defaultValue: DataTypes.NOW, //No funca por alguna razon
            },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('readinglists')
    },
}