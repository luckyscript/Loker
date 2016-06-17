var User = require('../controllers/user');

exports.register = function(app) {
    return function(req, res, next) {
        var context = {
            state: {
                state: 'register'
            },
            session: req.session

        };
        res.render('page', context);
    }
}
exports.registerHandle = function(app) {
    return function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var invite = req.body.invite;
        var mail = req.body.mail;
        console.log(username, password, invite);

        user = new User ({
			username: username,
			password: password,
			mail: mail
		});

		user.register(function(err, user) {
			if (err) return next(err);
			if (user == 409) {
                // username is exist
                res.send({"result": "0"});
                console.log("this");
    			res.statusCode = 409;
                return;
			} else {
				res.statusCode = 200;
                res.send({"result": "1"});
                return;
			}
		})
    }
}
exports.loginHandle = function(app) {
    return function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var user = new User({
            username: username,
            password: password
        })
        user.login(function(err, userCode) {
            if (err) return next(err);
            console.log("here",user)
            if (userCode == 404) {
                console.log("not exist");
                // user not exist
                res.statusCode = 404;
                return;
            } else if (userCode == 403) {
                // wrong password
                res.send({"result": "1"});
                res.statusCode = 403;
            } else if (userCode == 200) {
                // success
                req.session.user = {
                    username: user.username
                };
                res.send({"result": "2"});
            }
        })
    }
}
exports.login = function(app) {
    return function (req, res, next) {
        var context = {
            state: {
                state: 'login'
            },
            session: req.session
        };
        res.render('page', context);
    }
}
exports.logout = function (app) {
    return function (req, res, next) {
        if (req.session.user.username) {
            req.session.destroy(function (err) {
                if (err) next(err);
                console.log('destroyed the session');
                res.status(302);
                res.redirect('/');
            });
        } else {
            res.status(302);
            res.redirect('/');
        }
    }
}