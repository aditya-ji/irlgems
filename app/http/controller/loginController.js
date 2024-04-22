const User=require('../../model/user.js')
const bcrypt = require('bcrypt');
const passport= require('passport');

function loginController() {
    return {

    //login route
      login(req, res) {
        res.render('login/login_', { layout: 'login/login_layout', message: req.flash('error') });
      },

      //login logic 
      postLogin(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            req.flash('error', 'An error occurred. Please try again.');
            return next(err);
          }
          if (!user) {
            req.flash('error', 'Incorrect email or password.');
            return res.redirect('/admin'); // Redirect to login page
          }
          req.logIn(user, (err) => {
            if (err) {
              req.flash('error', 'An error occurred. Please try again.');
              return next(err);
            }
            return res.redirect('/admin/home');
          });
        })(req, res, next);
      },
      logout(req, res) {
        req.logout((err) => {
          if (err) {
            // Handle the error
            console.error(err);
            return;
          }
          res.redirect('/admin');
        });
      }
      
    };
  }
  
  module.exports = loginController;
  