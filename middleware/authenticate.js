const {User} = require('../models/User.js')

var authenticate = function (req, res, next) {
    let token = req.header('x-auth');
    
    User.findByToken(token)
        .then((user) => {
            if (!user) return Promise.reject();
            else {
                req.user = user;
                req.token = token;
                next();
            }
        }).catch((err) => res.status(401).send())
}

var checkSession = async function(req,res,next){
  try {
    console.log('runnin');
    let ts = req.header('x-ts');
    if (ts) {
      console.log(req.session.user);
      if (!req.session.user)
        res.send({msg: 'no session persists'})
      else
        next();
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {authenticate,checkSession}
