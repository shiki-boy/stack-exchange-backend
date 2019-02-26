const express = require('express')
const sanitize = require('mongo-sanitize')
const {Tag} = require('../models/Tag') 


const router = express.Router()

router.get('/',(req,res)=>{
    Tag.find({}).select('countQ -_id tag')
    .then(docs =>{
        res.send(docs)
    })
})

router.get('/:id/:n',(req,res)=>{
  let id = sanitize(req.params.id)
  let n = parseInt(sanitize(req.params.n))

  // Tag.findById(id).populate('_qid')
  // .exec((err,questions)=>{
    // console.log('questions '+questions);
  // })
  Tag.findById(id,{_qid:{$slice:[n-1,n+5]}})
  .populate('_qid')
  // .select('_qid countQ')
  .then(doc=>{
    res.send(doc)
  })
  .catch(err=>res.send(err))
})

module.exports = router