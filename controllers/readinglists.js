const router = require('express').Router()
const {tokenExtractor} = require("../util/middleware")

const ReadingLists = require('../models/readinglists')

router.post('/', async (req, res) => {
    const bookAdded = await ReadingLists.create(req.body)
    return res.json(bookAdded)
})

router.put('/:id',tokenExtractor,  async (req, res) => {
    const readinglists = await ReadingLists.findByPk(req.params.id)

    if(readinglists){
        if(readinglists.userId !== req.decodedToken.id){
            throw new Error("Invalid user to make this action")
        }

        readinglists.read = req.body.read
        await readinglists.save()
        return res.json(readinglists)
    }

    return res.status(404).end()
})

module.exports = router