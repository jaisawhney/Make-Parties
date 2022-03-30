const jwt = require('jsonwebtoken');

function generateJWT(user) {
    return jwt.sign({id: user.id}, "AUTH-SECRET", {expiresIn: 60 * 60 * 24 * 60})
}


module.exports = function (app, models) {

    // Login (GET)
    app.get('/login', (req, res) => {
        res.render('login', {});
    });

    // Sign-up (GET)
    app.get('/sign-up', (req, res) => {
        res.render('sign-up', {});
    });

    // Login (POST)
    app.post('/login', async (req, res) => {
        const user = await models.User.findOne({where: {email: req.body.email}});
        if (!user) {
            req.session.sessionFlash = {type: 'danger', message: 'Could not find that user!'}
            return res.redirect('/login');
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                req.session.sessionFlash = {type: 'danger', message: 'Invalid credentials!'}
                return res.redirect('/login');
            }
            const mpJWT = generateJWT(user);
            res.cookie("mpJWT", mpJWT)

            res.redirect('/')
        }).catch(err => {
            console.error(err);
            return res.redirect('/login');
        });
    });

    // Sign-up (POST)
    app.post('/sign-up', async (req, res) => {

        const existingUser = await models.User.findOne({where: {email: req.body.email}});
        if (existingUser) {
            req.session.sessionFlash = {type: 'danger', message: 'That user already exists! Try logging in instead'}
            return res.redirect('/login');
        }

        models.User.create(req.body).then(user => {
            const mpJWT = generateJWT(user)
            res.cookie("mpJWT", mpJWT);
            res.redirect(`/`);
        }).catch((err) => {
            console.error(err)
        });
    });


    // Logout
    app.get('/logout', (req, res) => {
        res.clearCookie('mpJWT');
        req.session.sessionFlash = {type: 'success', message: 'You have been logged out!'}

        return res.redirect('/');
    });
}