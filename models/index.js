const Blog = require("./blog")
const User = require("./user")
const ReadingLists = require("./readinglists")
const Token = require("./token")

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingLists, as: "readings"})
Blog.belongsToMany(User, { through: ReadingLists, as: "readers"})

User.hasMany(Token)
Token.belongsTo(User)

module.exports = {
    Blog,
    User,
    ReadingLists,
    Token
}