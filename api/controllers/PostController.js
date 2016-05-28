/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req,res,next){
		var image = "";
		if(req.param('image').length!=0) {
				image = req.param('image')
		}
		var obj = {
				id_user : req.session.User.id,
				content : req.param('content'),
				image : image
		}
		Feed.create(obj, function(err,feed){
				if(err) return next(err);
				return res.redirect('/');
		});
	},
	delete : function(req,res,next){
			Feed.findOne({'id':req.param('id')}, function(err,feed){
					if(err) return next(err);
					Feed.destroy(feed.id, function(err,feed1){
							if(err) return next(err);
							return res.redirect('back');
					});
			})
	},
	post : function(req,res,next){
		return res.view();
	}
};
