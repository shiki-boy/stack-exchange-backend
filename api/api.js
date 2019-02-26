const express = require('express'),
  sanitize = require('mongo-sanitize'),{
    Question,
    createObjectId
} = require('../models/Question'),{
    Answer
  } = require('../models/Answer'),{
    authenticate
  } = require('../middleware/authenticate'),{
    User
  } = require('../models/User')

const router = express.Router()

router.get('/questions', (req, res) => {
  Question.find({}).select('-q').lean()
    .exec()
    .then((docs) => {
      res.send(docs)
    })
    .catch((err) => {
      res.send(err)
    })
})

router.get('/question/:id', (req, res) => {
  let id = sanitize(req.params.id)
  Question.findById(id).select('-_id -onModel').lean()
    .then((docs) => res.send(docs), (err) => res.send(err))
})

router.get('/answer/:id', (req, res) => {
  let id = sanitize(req.params.id)
  let ans = Answer.findById(id).select('-onModel -_id -__v')
    .then(docs => res.send(docs))
    .catch(e => res.send(e))
})

router.post('/createQuestion', (req, res) => {
  // TODO create question
  let qid = createObjectId();
  // var q = new Question({
  //     _id: qid,
  //     question_heading: req.body.q_h,
  //     question: req.body.q,
  //     tags: req.body.tags.split(" ")
  // })

  // console.log('test save question');

  // q.save().then(() => {
  //     res.send(q)
  // }, (err) => {
  //     res.send(err)
  // })

  // TODO create tag if not in db
  for (var tag of req.body.tags.split(" ")) {
    Tag.findOne({
        tag: tag
      }).lean()
      .exec()
      .then((docs) => {
        if (!docs) {
          let t = new Tag({
            tag,
            qid
          })

          t.save()
            .then(docs => res.send(docs))
            .catch(err => console.log(err))
        }
      }, (err) => {
        console.log(err);
      })
  }

})

router.patch('/upvote/:id', authenticate,async (req, res) => {
  try {
    let qid = sanitize(req.params.id)

    // ! find user by token
    let token = req.header('x-auth');
    let user = await User.findByToken(token)

    // ! check if already upvoted or not
    // ! also check downvoted or not
    var upvoted = await User.find({upvotes:qid}).lean()
    var incVote = 1
    if(!upvoted.length){
      let downvoted = await User.find({downvotes:qid}).lean()
      if(downvoted.length){
        incVote++
        User.findByIdAndUpdate(user.id,{
          $pull:{downvotes:qid}
        })
      }
      // ! vote++ in Question model
      await Question.findByIdAndUpdate(qid,{
        $inc:{votes: incVote}
      })

      // ! add upvote question in User model
      await User.findByIdAndUpdate(user.id,{
        $push:{
          upvotes:qid
        }
      }) 
      
      res.send('done')
    }
    else{
      // res.send('already upvoted')
      User.findByIdAndUpdate(user.id, {
        $pull: {upvotes: qid}
      })
      Question.findByIdAndUpdate(qid, {
        $inc: {votes: -1}
      })
    }
    
    
  } catch (error) {
    console.log(error)
  }
  
})

router.patch('/downvote/:id', authenticate,async (req,res)=>{
  try {
    let qid = sanitize(req.params.id)

    // ! find user by token
    let token = req.header('x-auth');
    let user = await User.findByToken(token)

    // ! check if already downvoted or not
    // ! also check upvoted or not
    let downvoted = await User.find({downvotes: qid}).lean()
    let incVote = -1

    if (!downvoted.length) {
      let upvoted = await User.find({upvotes: qid}).lean()
      if (upvoted.length) {
        incVote--
        User.findByIdAndUpdate(user.id, {
          $pull: {
            upvotes: qid
          }
        })
      }
      // ! vote-- in Question model
      await Question.findByIdAndUpdate(qid, {
        $inc: {
          votes: incVote
        }
      })

      // ! add downvote question in User model
      await User.findByIdAndUpdate(user.id, {
        $push: {
          downvotes: qid
        }
      })

      res.send('done')
    }
    else{
      // ! already downvoted
      // ! remove downvotes qid from User
      User.findByIdAndUpdate(user.id, {
        $pull: {downvotes: qid}
      })
      Question.findByIdAndUpdate(qid, {
        $inc: {votes: 1}
      })
    }

  } catch (error) {
    console.log(error)
  }
})

module.exports = router