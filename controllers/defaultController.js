module.exports = {
    index: (peticion, respuesta)=>{
        respuesta.render('default/index');
    },
    loginGet: (peticion, respuesta)=>{
        respuesta.render('default/login');
    },
    loginPost: (peticion, respuesta)=>{
        respuesta.send('hola')
    },
    registerGet: (peticion, respuesta)=>{
        respuesta.render('default/register');
    },
    registerPost: (peticion, respuesta)=>{
        respuesta.send("como esta");
    }
};