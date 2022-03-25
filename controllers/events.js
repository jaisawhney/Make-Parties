const moment = require("moment");

module.exports = function (app, models) {
    // Index
    app.get('/', (req, res) => {
        models.Event.findAll({order: [['createdAt', 'DESC']]}).then(events => {
            res.render('events-index', {events: events});
        });
    });

    // New
    app.get('/events/new', (req, res) => {
        res.render('events-new', {});
    });

    // Create
    app.post('/events', (req, res) => {
        models.Event.create(req.body).then(event => {
            res.redirect(`/events/${event.id}`)
        }).catch((err) => {
            console.error(err)
        });
    });

    //Show
    app.get('/events/:id', (req, res) => {
        models.Event.findByPk(req.params.id, {include: [{model: models.Rsvp}]}).then(event => {
            event.takesPlaceOnFormatted = moment(event.takesPlaceOn).format('MMMM Do YYYY, h:mm a');

            event.createdAtFormatted = moment(event.createdAt).format('MMMM Do YYYY, h:mm a');
            res.render('events-show', {event: event})
        }).catch((err) => {
            console.error(err);
        })
    });


    // Edit
    app.get('/events/:id/edit', (req, res) => {
        models.Event.findByPk(req.params.id).then((event) => {
            res.render('events-edit', {event: event});
        }).catch((err) => {
            console.error(err);
        })
    });

    // Update
    app.put('/events/:id', async (req, res) => {
        try {
            const event = await models.Event.findByPk(req.params.id);
            event.update(req.body);
            res.redirect(`/events/${req.params.id}`);
        } catch (err) {
            console.error(err);
        }
    });

    // Delete
    app.delete('/events/:id', (req, res) => {
        models.Event.findByPk(req.params.id).then(event => {
            event.destroy();
            res.redirect(`/`);
        }).catch((err) => {
            console.error(err);
        });
    });
}