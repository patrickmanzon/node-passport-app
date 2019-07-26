module.exports = {
	isAuthenticated(req, res, next) {
		if(req.isAuthenticated()) next()
		req.flash("msg_error", "You need to login to continue.")
		res.redirect("/user/login")
	}
}