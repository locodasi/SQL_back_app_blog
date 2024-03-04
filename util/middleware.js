const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")

const {Token, User} = require("../models")

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (!(authorization && authorization.toLowerCase().startsWith('bearer '))){
        return res.status(401).json({ error: 'token missing' })
    }
    
    const session = await validateToken(authorization.substring(7))

    if (!session) {
        return res.status(401).json({ error: 'no valid session' })
    }

    if (session.user.disabled) {
        return res.status(401).json({ error: 'account disabled' })
    }

    req.user = session.user
    next()
}

const validateToken = async (token) => {
    return await Token.findOne({
        where: {
            value : token
        },
        include: {
            model: User
        }
    })
}

module.exports= {tokenExtractor}