/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
		login : function(req,res,next){
				if(req.session.authenticated) return res.redirect('/');
				return res.view();
		},
		create : function(req,res,next){
			User.findOne({ or : [{'email' : req.param('email')}, {'username' : req.param('email')}]}, function(err,user){
					if(err) return next(err);
					if(!user) {
							var msg = ["The user does not exist"];
							req.session.flash = {
								err : msg
							}
							return res.redirect('/login');
					}
					if(user.password==req.param('password')){
							req.session.authenticated = true;
							req.session.User = user;
							return res.redirect('/');
					} else {
						var msg = ["Your password is wrong"];
						req.session.flash = {
							err : msg
						}
						return res.redirect('/login');
					}
			});
		},
		logout : function(req,res,next){
			if(!req.session.authenticated) return res.redirect('/');
			req.session.destroy();
			return res.redirect('/');
		}
};
