const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const User = require("../models/User")
const Auth = require("../config/auth")


router.get('/dashboard', Auth.isAuthenticated, (req, res) => {
	res.render('users/dashboard', {
		user: req.user
	})
})

router.get('/login', (req, res) => {
	res.render('users/login')
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/user/dashboard',
	    failureRedirect: '/user/login',
	    failureFlash: true 
	})(req, res, next)
})

router.get('/register', (req, res) => {
	res.render('users/register')
})

router.post('/register', (req, res) => {
	
	let { name, email, password, confirmPassword } = req.body
	let errors = []

	if(!name || !email || !password || !confirmPassword){
		errors.push({msg: "All fields are required."})
	}

	if(password.length < 6){
		errors.push({msg: "Password needs to be atleast 6 characters long."})
	}

	if(password !== confirmPassword){
		errors.push({msg: "Passwords don't match!"})
	}

	if(errors.length > 0){
		res.render('users/register', {
			errors
		})
	}else{

		const newUser = new User({
			name,
			email,
			password
		})

		User.findOne({email}, (user) => {

			if(user){
				errors.push({msg: "Email already in use."})
				res.render('users/register', {
					errors
				})
			}

			bcrypt.genSalt(10, (err, salt) => {
				if(err) throw error
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) throw error
					newUser.password = hash
					newUser.save()
						.then(user => {
							req.flash("msg_success", "You can now login!")
							res.redirect("/user/login")
						})
						.catch(err => console.log(err))
				})
			})
		})
	}
})

router.get('/logout', (req, res) => {
	req.logout()
	req.flash('msg_success', 'Logout successfully')
	res.redirect('/user/login')
})

module.exports = router