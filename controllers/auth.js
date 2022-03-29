const jwt = require('jsonwebtoken');

function generateJWT(user) {
    return jwt.sign({id: user.id}, "AUTH-SECRET", {expiresIn: 60 * 60 * 24 * 60})
}


module.exports = function (app, models) {

    // Login (GET)
    app.get('/login', (req, res, next) => {
        res.render('login', {});
    });

    // Sign-up (GET)
    app.get('/sign-up', (req, res, next) => {
        res.render('sign-up', {});
    });

    // Login (POST)
    app.post('/login', (req, res, next) => {
        models.User.findOne({where: {email: req.body.email}}).then(user => {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) {
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
    });

    // Sign-up (POST)
    app.post('/sign-up', async (req, res, next) => {

        const existingUser = await models.User.findOne({where: {email: req.body.email}});
        if (existingUser) return res.redirect('/login');

        models.User.create(req.body).then(user => {
            const mpJWT = generateJWT(user)
            res.cookie("mpJWT", mpJWT);
            res.redirect(`/`);
        }).catch((err) => {
            console.error(err)
        });
    });


    // Logout
    app.get('/logout', (req, res, next) => {
        res.clearCookie('mpJWT');
        return res.redirect('/');
    });
}