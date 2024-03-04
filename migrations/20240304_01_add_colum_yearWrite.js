const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year_writed', {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1991,
                max: new Date().getFullYear(), // Obtener el año actual dinámicamente
                msg: "Year Writed must be beetwen 1991 and the current year"
            },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year_writed')
    },
}