/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
		index : function(req,res,next){
				if(req.session.authenticated) {
						Feed.find()
						.sort('createdAt DESC')
						.populate('id_user')
						.exec(function(err,feeds){
								if(err) return next(err);
								return res.view({feeds:feeds});
						})
				} else {
						return res.view();
				}
		}
};
