module.exports = {
    mongoDbUrl: 'mongodb://localhost:27017/tylox',
    PORT: process.env.PORT || 3000,
    globalVariables: (peticion, respuesta, siguiente)=>{
        respuesta.locals.success_message = peticion.flash('success message');
        respuesta.locals.error_message = peticion.flash('error message');
    
        siguiente();
    }
};