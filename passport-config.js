const {
    Strategy,
    ExtractJwt
} = require('passport-jwt');

const secret = require('./config/keys').jwtSecret;
const User = require('./models/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

module.exports = passport => passport.use(
    new Strategy(opts, (payload, done) => {
        User.findById(payload.id)
            .then(user => {
                if (user) {
                    return done(null, {
                        id: user.id,
                        username: user.username,
                    });
                }
                return done(null, false);
        });
    });
);
    