const express = require("express")
const ejsLayout = require('express-ejs-layouts')
const mongoose = require("mongoose")
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express()

// Initialize connection
mongoose.connect(require('./config/keys').mongoId, {useNewUrlParser: true})

require('./config/passport')(passport)

app.use(session({
  secret: 'yeah boy',
  resave: true,
  saveUninitialized: true,
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

// set global variables
app.use((req, res, next) => {
	res.locals.msg_success = req.flash("msg_success")
	res.locals.msg_error = req.flash("msg_error")
	res.locals.error = req.flash("error")
	res.locals.user = req.user
	res.locals.auth = req.isAuthenticated()
	next()
})

//set the layouts to ejs
app.use(ejsLayout)
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// set assets directory
app.use(express.static('public'))

app.use('/', require('./routes/pages'))
app.use('/user', require('./routes/users'))
app.use('/blogs', require('./routes/blogs'))

app.listen(5000, () => console.log("Logging on port 5000"))