var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var hbs = require('express-handlebars');
var path = require('path');
var app = express();
var flash = require('connect-flash');
var session = require('express-session');
var {mongoDbUrl, PORT} = require('./config/configuration');
var {globalVariables} = require('./config/configuration');
var methodOverride = require('method-override');
var {selectOption} = require('./config/customFunctions');
var fileUpload = require('express-fileupload');
var passport = require('passport');

/*Configuración de mongoose para conectar a MongoDB*/
mongoose.connect(mongoDbUrl, {useNewUrlParser: true}).then(
    response=>{
        console.log("Conexión a la BD establecida");
    }
).catch(
    err => {
        console.log("Conexión a la BD fallida");
    }
);


/*Configuración de express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


/*Configuración de Flash y Session */
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/*Para Usar Variables Globales*/
app.use(globalVariables);

/*File Upload*/
app.use(fileUpload());

/*Configuración del motor de vistas para usar handlebars*/
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine', 'handlebars');

/*Method Override*/
app.use(methodOverride('newMethod'));

/*Rutas*/
var defaultRoutes = require("./routes/defaultRoutes");
var adminRoutes = require("./routes/adminRoutes");
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor levantado en el puerto ${PORT}`);
})
