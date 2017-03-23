var User = require('../models/user'),
    Event = require('../models/event').events,
	moment = require("moment"),
    UpcomingEvent = require('../models/event').upcomingEvents;

module.exports = function(apiRouter) {
    apiRouter.route('/users/:userID/events')
        .get(function(req, res) {
            req.user.populate('events', function(err, user) {
                if (err) return res.send(err);
                res.json(user.events);
            });
        })
        .post(function(req, res) {
            var event = new Event();
            event.name = req.body.name;
            event.date = new Date(req.body.date);
            event.hours = req.body.hours;
            event.user = req.user;

            event.save(function(err, event) {
                if(err) return res.send(err);

                req.user.events.push(event);
                req.user.save(function(err, user) {
                    if(err) return res.send(err);
                    res.json(user);
                });
            });
        });

    apiRouter.route('/users/:userID/events/:eventID')
        .get(function(req, res) {
            Event.findById(req.params.eventID).lean().exec(function(err, evt) {
				// evt.date = moment(evt.date).format("YYYY MM DD");
				res.json(evt);
            });
        })
        .put(function(req, res) {
            Event.findById(req.params.eventID, function(err, event) {
                if(err) return res.send(err);

                if(req.body.name) event.name = req.body.name;
                if(req.body.hours) event.hours = req.body.hours;
                if(req.body.date) event.date = new Date(req.body.date);
                if(req.body.checked) event.checked = req.body.checked;

                event.save(function(err) {
                    if(err) res.send(err);

                    res.json({message: 'Event updated'});
                });
            });
        })
        .delete(function(req, res) {
            var id = req.params.eventID;
            Event.remove({
                _id: id
            }, function(err, user) {
                if(err) return res.send(err);
                req.user.events.splice(req.user.events.indexOf(req.params.eventID), 1);
                req.user.save(function(err, user) {
                    if(err) return res.send(err);
                    res.json({message: 'succesfully deleted', _id: id});
                });
            });
        });

    apiRouter.get('/upcoming-events', function(req, res) {
        var filter = {};
        if(req.query.name) {
            filter = {
                name: new RegExp(req.query.name,"i"),
            };
        }

        UpcomingEvent.find(filter).sort("date")
        .exec(function(err, uevents) {
            if(err) res.send(err);

            res.json(uevents);
        });
    });


    apiRouter.delete('/upcoming-events/:ueventID', function(req, res) {
        var id = req.params.ueventID;
        UpcomingEvent.remove({
            _id: id
        }, function(err, user) {
            if(err) return res.send(err);
            res.json({message: 'succesfully deleted', _id: id});
        });

    });

};
