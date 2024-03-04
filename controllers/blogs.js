const router = require("express").Router()
const {tokenExtractor} = require("../util/middleware")
const { Op } = require("sequelize")


const { Blog, User } = require('../models')

const blogFinder = async (req,res,next) => {
    req.blog = await Blog.findByPk(req.params.id)
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
    const blog = await Blog.create({...req.body, userId: req.user.id})
    return res.json(blog)
})

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
    if(req.blog){
        if(req.user.id !== req.blog.userId){
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