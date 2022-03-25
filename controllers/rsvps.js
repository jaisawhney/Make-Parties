module.exports = (app, models) => {
    // New
    app.get('/events/:eventId/rsvps/new', (req, res) => {
        models.Event.findByPk(req.params.eventId).then(event => {
            res.render('rsvps-new', {event: event});
        });
    });

    // Create
    app.post('/events/:eventId/rsvps', (req, res) => {
        req.body.EventId = req.params.eventId;
        models.Rsvp.create(req.body).then(() => {
            res.redirect(`/events/${req.params.eventId}`);
        }).catch((err) => {
            console.error(err)
        });
    });

    // Show
    app.get('/events/:id', (req, res) => {
        models.Event.findByPk(req.params.id, {include: [{model: models.Rsvp}]}).then(event => {
            res.render('events-show', {event: event});
        }).catch((err) => {
            console.error(err);
        })
    });
}