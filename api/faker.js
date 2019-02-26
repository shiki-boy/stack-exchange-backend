const express = require('express')
const faker = require('faker')

const {
  Question
} = require('../models/Question'), {
  Answer
} = require('../models/Answer'), {
  Tag
} = require('../models/Tag'), {
  createObjectId
} = require('../models/models.js'),{
  User
} = require('../models/User')

const router = express.Router()



router.get('/fakeQnT', async (req, res) => {
  try {
  console.log('running');
  let users = await User.find({}).select('_id').lean()
    console.log(users);
  await Tag.deleteMany({})
  await Question.deleteMany({})
  console.log(1);
  let fakeTags = faker.random.words(10).split(' ')
    for (var i = 0; i < 20; i++) {
      var id = createObjectId()
      let l = faker.random.number({
        min: 0,
        max: 5
      })
      let u = faker.random.number({
        min: 6,
        max: 9
      })
      var x = fakeTags.slice(l, u).join(' ')

      let dummy = new Question({
        _id: id,
        q_h: faker.lorem.sentence(),
        q: faker.lorem.paragraph(4),
        votes: faker.random.number({
          min: 1,
          max: 100
        }),
        // answers: faker.random.words().length,
        date: faker.date.recent(),
        tags: x.split(" "),
        _creator: faker.random.arrayElement(users),
        onModel: 'User'
      })
      // console.log(x, 2);
      // ! question faked
      await dummy.save()

      // ? added question_created for user model
      await User.findByIdAndUpdate(dummy._creator,{
        $push:{
          questions_created: dummy._id
        }
      })

      console.log(3);
      for (var tag of x.split(' ')) {
        let doc = await Tag.findOne({
          tag
        })
        if (!doc) {
          console.log('creating new ' + tag);
          var t = new Tag({
            tag,
            qid: id
          })
          t.save()
          console.log('tag saved');
        } else {
          console.log('updateDoc');
          let updateDoc = await Tag.findOneAndUpdate({
            tag
          }, {
            $push: {
              _qid: id
            },
            $inc: {
              countQ: 1
            }
          })

        }
      }
    }
    res.send('done')
  } catch (err) {
    console.log(err);
  }


})


router.get('/fakeAns', async (req, res) => {
  try {
    let qids = await Question.find({}).select('_id').lean()
    let users = await User.find({}).select('_id').lean()

    for (var i = 0; i < 20; i++) {
      let fakeQid = faker.random.objectElement(qids, "_id")

      let ans = new Answer({
        answer: faker.lorem.paragraph(3),
        votes: faker.random.number({
          min: 1,
          max: 100
        }),
        _qid: fakeQid,
        _creator: faker.random.arrayElement(users),
        onModel: 'User'
      })

      await ans.save() // ! ans saved

      // ? answers_created for user model
      await User.findByIdAndUpdate(ans._creator,{
        $push:{
          answers_created:ans._id
        }
      }) 

      // ? answer in Question model "ref"
      await Question.findByIdAndUpdate(fakeQid, {
        $push: {
          answers: ans._id
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
  res.send('fakedans');
})


router.get('/test', async (req, res) => {
  try {
    for (var i = 0; i < 3; i++) {
      let l = faker.random.number({
        min: 0,
        max: 3
      })
      let u = faker.random.number({
        min: 4,
        max: 5
      })
      let x = fakeTags.slice(l, u).join(' ')
      console.log(fakeTags + ' ALL');
      for (var tag of x.split(' ')) {
        let doc = await Tag.findOne({
          tag
        })
        if (!doc) {
          console.log('creating new ' + tag);
          var t = new Tag({
            tag
          })
          t.save()
          console.log('tag saved');
        }
      }
    }
  } catch {

  }
})

router.get('/xy', async (req, res) => {
  let up = await Question.findOneAndUpdate({
    _id: "5c5af769822c9444449107c0"
  }, {
    $push: {
      answers: "5c5c1314fa2e6d329084ab27"
    }
  })

  res.send(up)
})

module.exports = router