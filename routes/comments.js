const express 	= require("express"),
	Campground  = require("../models/campground"),
	Comment 	= require("../models/comment"),
	router 		= express.Router({
		mergeParams: true
	}),
	mdw 		= require("../middleware");


// router.get("/new", mdw.isLoggedIn, function (req, res) {
// 	Campground.findById(req.params.id, function (err, found) {
// 		if (err) {
// 			console.log(err);
// 			req.flash("error", "Campground not found");
// 			res.redirect("back");
// 		} else {
// 			res.render("comments/new", {
// 				campground: found
// 			});
// 		}
// 	});
// });

router.post("/", mdw.isLoggedIn, function (req, res) {
	Campground.findOne({
		"_id": req.params.id
	}, function (err, campground) {
		if (err) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.isAdmin = req.user.isAdmin;
					comment.postedTo = req.params.id;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

// router.get("/:comment_id/edit", function (req, res) {
// 	Comment.findOne({
// 		"_id": req.params.comment_id
// 	}, function (err, foundComment) {
// 		if (err) {
// 			console.log(err);
// 			req.flash("error", "Campground not found");
// 			res.redirect("/campgrounds" + req.params.id);
// 		} else {
// 			res.render("comments/edit", {
// 				campground_id: req.params.id,
// 				comment: foundComment
// 			});
// 		}
// 	});
// });

router.put("/:comment_id", mdw.checkCommentOwnership, function (req, res) {
	Comment.findOneAndUpdate({
		"_id": req.params.comment_id
	}, req.body.comment, {new: true}, function (err, comment) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/campgrounds" + req.params.id);
		} else {
			if(req.xhr){
				res.json({comment: comment});
			} else {
				req.flash("success", "Comment updated");
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	});
});

router.delete("/:comment_id", mdw.checkCommentOwnership, function (req, res) {
	Comment.findOneAndDelete({
		"_id": req.params.comment_id
	}, function (err) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			if(req.xhr){
				res.json({success: true});
			} else {
				req.flash("success", "Comment deleted");
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	});
});


module.exports = router;