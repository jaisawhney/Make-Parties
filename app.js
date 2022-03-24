const express = require('express')
const app = express()
const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

app.engine('handlebars', engine({defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

const events = [
    {
        title: "I am your first event",
        desc: "A great event that is super fun to look at and good",
        imgUrl: "http://via.placeholder.com/600"
    },
    {
        title: "I am your second event",
        desc: "A great event that is super fun to look at and good",
        imgUrl: "http://via.placeholder.com/600"
    },
    {
        title: "I am your third event",
        desc: "A great event that is super fun to look at and good",
        imgUrl: "http://via.placeholder.com/600"
    }
]

app.get('/', (req, res) => {
    res.render('events-index', {events: events});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!')
});