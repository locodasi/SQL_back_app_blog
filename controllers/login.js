const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')

const { SECRET } = require('../util/config')
const {User, Token} = require('../models')

router.post('/login', async (request, response) => {
    const body = request.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'secret'

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    if (user.disabled) {
        return response.status(401).json({
            error: 'account disabled, please contact admin'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    await Token.create({ value: token, userId: user.id })

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

router.delete('/logout', tokenExtractor, async (req, res) => {
    await Token.destroy({
        where: {
            userId: req.user.id
        }
    })
    
    res.status(200).send({
        message: 'token revoken'
    })
})

module.exports = router