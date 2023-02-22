var LocalStrategy = require('passport-local').Strategy;
const mongoose=require('mongoose');



const User=require('./models/user');
exports.initializingPassport=(passport)=>{
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            if (!user.password) {
              return done(null, false)
            }
      
            user.comparePassword(password, (err, isMatch) => {
              if (err) { return done(err) }
              if (isMatch) {
                return done(null, user)
              }
              return done(null, false, { msg: 'Invalid email or password.' })
            })
      
          });
        }
      ));


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


}


exports.isAuth=(req,res,next)=>{
    if(req.isAuthenticated()) return next();

    res.redirect('/login')

}
