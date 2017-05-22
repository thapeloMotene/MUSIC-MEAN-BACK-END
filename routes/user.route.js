var router = require('express').Router();
var User = require('../models/user.model');
var passport = require('passport');
var passportConf = require('../configs/passport');
var async = require('async');



router.post('/register', (req,res,next)=>{

            	var user = new User();
				user.email = req.body.email;
				user.password = req.body.password;
				user.name = req.body.name;
				user.picture = user.gravatar();
        
        	    User.findOne({ email: req.body.email }, function(err, existingUser){
					if(existingUser){
						return res.json({"message":"Account with that email already exists"});
					}else{

						user.save(function(err, user){
							if(err) return next(err);
							return res.json(user);
							});
					}
				});
        

});

router.get('/users', (req,res,next)=>{
    User.find({},function(err,users){
        res.json(users);
    });

});

router.post('/login', (req,res, next)=>{
	passport.authenticate('local-login', function(err, user, info) {
	if (err) return res.json({"isAuthenticaed":false, "message":"Error connecting to database, please try again later"});
	if (!user) return  res.json({"message":"No user found in the database"});
	res.json(user);
	})(req, res, next);
});

router.post('/edit-profile',(req,res,next)=>{
	let usr = req.body;

	async.waterfall([
		(callback)=>{
			User.findOne({_id: req.body._id}, (err,user)=>{
				if (err) return res.json({"error": true});
				callback(null,user);
		});
		},
		(user)=>{

			if (usr.isNewPass){
				user.name = usr.name;
				user.email = usr.email;
				user.password =usr.password;
			}else{
					user.name = usr.name;
					user.email = usr.email;
			}

			user.save((err,updatedUser)=>{
				console.log(updatedUser);
				if (err) return res.json({"error":true});
				res.json(updatedUser);
			});

		}
	])
	
});

module.exports = router;