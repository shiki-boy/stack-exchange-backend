const express = require('express')
const sanitize = require('mongo-sanitize')
const {
  Tag
} = require('../models/Tag')


const router = express.Router()

router.get('/', (req, res) => {
  Tag.find({}).select('countQ _id tag')
    .then(docs => {
      res.send(docs)
    })
})

router.get('/:id', async (req, res) => {
  let id = sanitize(req.params.id)

  try {

    let tag = await Tag.findById(id).populate({
      path: "_qid",
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).exec()

    res.send(tag)

  } catch (error) {
    console.log(error)
  }

})

module.exports = router