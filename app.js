const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const models = require('./db/models');

app.engine('handlebars', engine({defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));

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
    models.Event.create(req.body).then(() => {
        res.redirect(`/`);
    }).catch((err) => {
        console.log(err)
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!')
});