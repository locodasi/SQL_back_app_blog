const  { Model, DataTypes } = require("sequelize")

const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        yearWrited: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1991,
                max: new Date().getFullYear(), // Obtener el año actual dinámicamente
                msg: "Year Writed must be beetwen 1991 and the current year"
            },
        }
    }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

module.exports = Blog