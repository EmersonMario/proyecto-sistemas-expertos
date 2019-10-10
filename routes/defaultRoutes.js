var express = require("express");
var router = express.Router();
var defaultController = require('../controllers/defaultController');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/UserModel').User;
var Template = require('../models/TemplateModel').Template;

/*Configuración de las rutas*/
router.all('/*', (peticion, respuesta, siguiente)=>{
    peticion.app.locals.layout = 'default';
    siguiente();
});

router.route('/').get(defaultController.index);

//Definiendo 
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (peticion, email, password, done)=>{
    User.findOne({email: email}).then(user=>{
        if(!user){
            return done(null, false, peticion.flash('error-message', 'Usuario no encontrado con este correo electrónico'));
        }
        bcrypt.compare(password, user.password, (err, passwordMatched)=>{
            if(err){
                return err;
            }
            if(!passwordMatched){
                return done(null, false, peticion.flash('error-message', 'Usuario inválido o contraseña incorrecta'));
            }
            return done(null, user, peticion.flash('success-message', 'Ha iniciado sesión satisfactoriamente'))
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.route('/login').get(defaultController.loginGet).post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
}), defaultController.loginPost);

router.route('/register').get(defaultController.registerGet).post(defaultController.registerPost);

router.route('/post/:id').get(defaultController.getSinglePost).post(defaultController.submitComment);

router.get('/logout', (peticion, respuesta)=>{
    peticion.logOut();
    peticion.flash('success-message', 'Se ha cerrado sesión satisfactoriamente');
    respuesta.redirect('/');
});


module.exports = router;