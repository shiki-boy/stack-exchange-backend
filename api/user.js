const express = require('express'),
  bcrypt = require('bcryptjs'),
  sanitize = require('mongo-sanitize'),
  {
    OAuth2Client
  } = require('google-auth-library'),
  {
    authenticate,checkSession
  } = require('../middleware/authenticate.js'),
  {
    User
  } = require('../models/User.js'),
  {
    UserAP
  } = require('../models/UserAP.js');

const router = express.Router()


router.post('/signup', (req, res) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(sanitize(req.body.password), salt)

  let user = new User({
    email: sanitize(req.body.email),
    username: sanitize(req.body.username),
    password: hash
  })

  user.save()
    .then(user => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch((e) => res.status(400).send('error'))
})


router.post('/tryAutoLogin',checkSession, authenticate, (req, res) => {
  res.status(200).send({msg:'correct'});
})


router.post('/gapi/verify', async (req, res) => {
  const token = req.body.id_token
  const client = new OAuth2Client("1030991878062-p4makopstk5jtdobiv2umqr61rmgtpo3.apps.googleusercontent.com");
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1030991878062-p4makopstk5jtdobiv2umqr61rmgtpo3.apps.googleusercontent.com",
    })
    // console.log(ticket.getPayload())

    UserAP.findOne({
        email: ticket.getPayload().email
      }).then(userAP => {
        if (!userAP) {
          UserAP.create({
              email: ticket.getPayload().email,
              username: ticket.getPayload().email,
              Auth_Provider: 'google'
            }).then(doc => res.send(doc))
            .catch((err) => res.send(err))
        } else {
          res.status(200).send({
            msg: 'logged in'
          })
        }
      })
      .catch((err) => res.send(err))

  } catch (err) {
    res.status(401).send(err);
  }

})


router.post('/findUser', async (req, res) => {
  try {
    let query = sanitize(req.body.query)
    if(req.body.isEmail)
      var doc = await User.findOne({email:query}).exec()
    else
      var doc = await User.findOne({username:query}).exec()

    if (!doc) res.send({error:true,msg:`invalid ${req.body.isEmail ? 'email': 'username'}`})
    else {
      if (bcrypt.compareSync(req.body.password, doc.password)) {
        let token = await doc.generateAuthToken()
        req.session.user = doc.username
        console.log('session set');
        console.log(req.session.user)
        res.header('x-auth', token).status(200).send({user:doc})
      } else {
        res.send({error:true,msg:'invalid password'})
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/isUnique/e/:email', (req, res) => {
  let email = req.params.email
  User.findOne({
      email: email
    }).lean()
    .then(doc => {
      if (!doc) res.send('true')
      else res.send('false')
    })
    .catch(err => res.send('error'))
})


router.get('/isUnique/u/:username', (req, res) => {
  let username = req.params.username
  User.findOne({
      username: username
    }).lean()
    .then(doc => {
      if (!doc) res.send('true')
      else res.send('false')
    })
    .catch(err => res.send('error'))
})


module.exports = router