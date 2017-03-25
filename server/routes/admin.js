var User = require('../models/user'),
    Event = require('../models/event').events,
    UpcomingEvent = require('../models/event').upcomingEvents;

module.exports = function(apiRouter) {
    var checkAdmin = function(req, res, next) {
        console.log("BOL IS AN ADMIN?", req.decoded.admin);
        if(req.decoded.admin) {
            next();
        } else {
            res.send({message: "You are not an admin!"});
        }

    };

    apiRouter.post('/upcoming-events', checkAdmin, function(req, res) {
        var event = new UpcomingEvent(req.body);

        event.save(function(err, event) {
            if(err) return res.send(err);

            res.json({message: "Upcoming event saved!"});
        });
    });

    apiRouter.put('/upcoming-events/:ueventID', checkAdmin, function(req, res) {
        UpcomingEvent.findById(req.params.ueventID, function(err, uevent) {
            if(req.body.name) uevent.name = req.body.name;
            if(req.body.timeStart) uevent.timeStart = req.body.timeStart;
            if(req.body.timeEnd) uevent.timeEnd = req.body.timeEnd;
            if(req.body.date) uevent.date = req.body.date;
            if(req.body.description) uevent.description = req.body.description;
            if(req.body.location) uevent.location = req.body.location;

            uevent.save(function(err) {
                if(err) res.send(err);

                res.json({message: 'Upcoming event updated! Luv you fromal'});
            });
        });
    });

    apiRouter.route('/users/:userID/events/:eventID/check')
        .all(checkAdmin)
        .post(function(req, res) {
            Event.findById(req.params.eventID, function(err, event) {
                event.checked = true;

                event.save(function(err) {
                    if(err) res.send(err);

                    res.json({message: 'Event checked!'});
                });
            });
        })
        .get(function(req, res) {
            Event.findById(req.params.eventID, function(err, event) {
                res.send({checked: !!event.checked});
            });
        });

    apiRouter.put('/users/:userID/toggle-admin', checkAdmin, function(req, res) {
        User.findById(req.params.userID, function(err, user) {
            user.admin = !user.admin;

            user.save(function(err) {
                if(err) res.send(err);

                res.json({message: user.admin ? 'User is now an admin' : 'User is no longer an admin'});
            });
        });
    });

    apiRouter.put('/users/:userID/reset-password', checkAdmin, function(req, res) {
        User.findById(req.params.userID, function(err, user) {
            user.admin = !user.admin;

            user.save(function(err) {
                if(err) res.send(err);

                res.json({message: user.admin ? 'User is now an admin' : 'User is no longer an admin'});
            });
        });
    });
};
