var User = require('../models/user'),
    Event = require('../models/event').events,
    UpcomingEvent = require('../models/event').upcomingEvents,
    config = require('../../config'),
    jwt = require('jsonwebtoken');

module.exports = function(app, express) {
    var apiRouter = express.Router();


    apiRouter.route('/users')
        .post(function(req, res) {
            var user = new User();
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.username = req.body.username.toLowerCase();
            user.password = req.body.password;
            user.gradyear = Number(req.body.gradyear);
            if(req.body.admin) user.admin = true;
			

            user.save(function(err) {
                if(err) {
                    if(err.code == 11000)
                        return res.json({success: false, message: 'username already exists'});
                    else
                        return res.send(err);
                }
                res.json({message: 'User Created!', success: true});
            });
        });

    apiRouter.post('/token', function(req, res) {
        User.findOne({username: req.body.username})
        .select('lastname firstname username password admin').exec(function(err, user) {
            if(err) throw err;

            if(!user) {
                res.json({
                    success: false,
                    message: 'Incorrect username'
                });
            } else {
                var validPass = user.comparePassword(req.body.password);
                if(!validPass) {
                    res.json({
                        success: false,
                        message: 'Incorrect password. If you forgot it hit up Mat or Jason or Fromal'
                    });
                } else {
                    var token = jwt.sign({
                        firstname: user.firstname,
                        lastname: user.lastname,
                        name: user.name,
                        username: user.username,
                        admin: user.admin,
                        id: user._id
                    }, config.secret, {
                        expiresIn: 60*60*24
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy!',
                        token: token
                    });
                }
            }
        });
    });

    apiRouter.use(function(req, res, next) {
        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, config.secret, function(err, decoded) {
                if(err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to auth token'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });

    apiRouter.get('/', function(req, res) {
        res.json({ message: 'sup bruh'});
    });

    apiRouter.route('/users')
        .get(function(req, res) {
            User.find({}).populate('events').lean().exec(function(err, users) {
                if(err) res.send(err);

                res.json(users);
            });
        })
    ;

    apiRouter.route('/users/:userID')
        .get(function(req, res) {
            User.findById(req.params.userID, function(err, user) {
                res.json(user);
            });
        })
        .put(function(req, res) {
            User.findById(req.params.userID, function(err, user) {
                if(req.body.name) user.name = req.body.name;
                if(req.body.username) user.username = req.body.username;
                if(req.body.password) user.password = req.body.password;

                user.save(function(err) {
                    if(err) res.send(err);

                    res.json({message: 'User updated'});
                });
            });
        })
        .delete(function(req, res) {
            User.remove({
                _id: req.params.userID
            }, function(err, user) {
                if(err) return res.send(err);
                res.json({message: 'succesfully deleted'});
            });
        })
    ;

    apiRouter.param('userID', function(req, res, next, id) {
        var query = User.findById(id);

        query.exec(function (err, user){
            if (err) { return next(err); }
            if (!user) { return next(new Error('can\'t find user')); }

            req.user = user;
            return next();
        });
    });


    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    require("./events")(apiRouter);

    require("./admin")(apiRouter);

    return apiRouter;
};
