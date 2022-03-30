const express = require('express')
const session = require('express-session')

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
            if (one === two) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.use(cookieParser("SECRET"));

const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60);
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {expires: expiryDate},
    resave: false
}));
app.use((req, res, next) => {
    const token = req.cookies.mpJWT;

    if (token) {
        jwt.verify(token, "AUTH-SECRET", (err, user) => {
            if (err) {
                console.error(err)
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
            console.error(err)
        })
    } else {
        next();
    }
});
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!')
});