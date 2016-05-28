/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
 	create: function (req, res, next) {
		User.findOne({ or : [{'email' : req.param('email')}, {'username' : req.param('username')}]}, function(err,userfound){
				if(err) return next(err);
				if(userfound) {
					var msg = ['The email / username is already in use.']
					req.session.flash = {
	 					err : msg
	 				}
	 				return res.redirect('/');
				}
        if(req.param('confirmation')!=req.param('password')){
          var msg = ['The password and confirmation doesn\'t match.']
					req.session.flash = {
	 					err : msg
	 				}
	 				return res.redirect('/');
        };
				User.create(req.params.all(), function userCreated (err, user) {
		 			if (err) {
  					var msg = ['Please fill in completely'];
  					req.session.flash = {
  	 					err : msg
  	 				}
  	 				return res.redirect('/');
  				}
					req.session.authenticated = true;
					req.session.User = user;
					//req.session.flash = {};
		 			return res.redirect('/');
		 		});
		});
 	},
	wall : function(req,res,next){
		User.findOne({'username':req.param('username')}, function(err,user){
			if(!user) return res.redirect('/');
			Feed.find({'id_user':user.id}, {'sort' : 'createdAt DESC'}, function(err,feeds){
					return res.view({feeds:feeds, user:user});
			});
		});
	},
	search : function(req,res,next){
			var q = req.param('q');
      q = q.toLowerCase();
			User.find(function(err,users){
					if(err) return next(err);
          var ans = [];
          for(var i=0;i<users.length;i++){
            var found = false;
            var name = users[i].name.toLowerCase();
            for(var j=0;j<=name.length-q.length;j++){
              var strtmp = name.substr(j,q.length);
              if(strtmp==q){
                found = true;
                break;
              }
            }
            if(found){
              ans.push(users[i]);
            }
          }
					return res.view({users:ans});
			});
	},
  setting : function(req,res,next){
      return res.view();
  },
  editname : function(req,res,next){
    User.update(req.session.User.id, {'name':req.param('name')}, function(err,userupdate){
        if(err) return next(err);
        return res.redirect('back');
    });
  },
  editusername : function(req,res,next){
    User.update(req.session.User.id, {'username':req.param('username')}, function(err,userupdate){
        if(err) return next(err);
        return res.redirect('back');
    });
  },
  editpassword : function(req,res,next){
    User.findOne(req.session.User.id, function(err,user){
        if(req.param('old_password')!=user.password){
          return res.send('Old password not same');
        } else {
          User.update(req.session.User.id, {'password':req.param('new_password')}, function(err,userupdate){
              if(err) return next(err);
              return res.redirect('back');
          });
        }
    })

  },
  createbio : function(req, res, next){
    User.findOne(req.session.User.id, function(err,user) {
      if(err) return next(err);
      User.update(req.session.User.id, {'bio':req.param('bio')}, function(err,userupdate){
          if(err) return next(err);
          return res.redirect('back');
      });
    })
  }
};
