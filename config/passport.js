const localStrategy = require("passport-local").Strategy
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = (passport) => {
	passport.use(
		new localStrategy({usernameField: 'email'}, (email, password, done) => {
			User.findOne({email:email}, (err, user) => {
				if(err) throw err
				if(!user) return done(null, false, {message: "Invalid Email or Password!"})

				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) throw err;
					if(!isMatch) return done(null, false, {message: "Invalid Email or Password"})
					return done(null, user)
				})

			})
		})
	)

	passport.serializeUser((user, done) => {
	  done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
	  User.findById(id, (err, user) => {
	    done(err, user);
	  });
	});
}