const express = require('express')
const methodOverride = require('method-override')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const models = require('./db/models');

app.engine('handlebars', engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        ifeq: (one, two, options) => {
            console.log(one)
            console.log(two)
            if (one === two) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use((req, res, next) => {
    const token = req.cookies.mpJWT;

    if (token) {
        jwt.verify(token, "AUTH-SECRET", (err, user) => {
            if (err) {
                console.log(err)
                res.redirect('/login')
            }
            req.user = user
            next();
        })
    } else {
        next();
    }
});

app.use((req, res, next) => {
    if (req.user) {
        models.User.findByPk(req.user.id).then(currentUser => {
            res.locals.currentUser = currentUser;
            next()
        }).catch(err => {
            console.log(err)
        })
    } else {
        next();
    }
});

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!')
});