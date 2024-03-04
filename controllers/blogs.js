const router = require("express").Router()
const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")
const { Op } = require("sequelize")


const { Blog, User } = require('../models')

const blogFinder = async (req,res,next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch{
            return res.status(401).json({ error: 'token invalid' })
        }
    }  else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {
    const where = {}

    if(req.query.search){
        where[Op.or] = [
            {
                title: {
                    [Op.substring]: req.query.search,
                }
            },
            {
                author: {
                    [Op.substring]: req.query.search
                }
            }
        ]
    }

    const blogs = await Blog.findAll({
        attributes: {exclude: ["userId"]},
        include: {
            model: User,
            attributes: ["username"]
        },
        where,
        order: [
            ["likes", "DESC"]
        ]
    });
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
})

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
    if(req.blog){
        if(req.decodedToken.id !== req.blog.userId){
            throw Error("Invalid user to delete this blog")
        }
        await req.blog.destroy()
    }
    res.status(204).end()
})

router.put("/:id", blogFinder, async (req, res) => {
    if(!req.body.likes){
        throw Error("missing likes")
    }
    if(req.blog){
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    }
    res.status(404).end()
})

module.exports = router