const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcrypt');

function init(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Login authenticate
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'Email not found' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user, { message: 'Logging in successful' });
      } else {
        return done(null, false, { message: 'Login failed' });
      }
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });
}

module.exports = init;
