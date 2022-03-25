const express = require('express')
const methodOverride = require('method-override')
const app = express()
const bodyParser = require('body-parser');

const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const models = require('./db/models');

app.engine('handlebars', engine({defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))

// Index
app.get('/', (req, res) => {
    models.Event.findAll({order: [['createdAt', 'DESC']]}).then(events => {
        res.render('events-index', {events: events});
    })
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
    models.Event.findByPk(req.params.id).then((event) => {
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
app.put('/events/:id', (req, res) => {
    models.Event.findByPk(req.params.id).then(event => {
        event.update(req.body).then(() => {
            res.redirect(`/events/${req.params.id}`);
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
        console.error(err);
    });
});

// Delete
app.delete('/events/:id', (req, res) => {
    models.Event.findByPk(req.params.id).then(event => {
        event.destroy();
        res.redirect(`/`);
    }).catch((err) => {
        console.error(err);
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!')
});